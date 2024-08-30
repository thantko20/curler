package request

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"net/textproto"
	"net/url"
	"strings"
	"time"
)

// type MultipartValueType string

// const (
//
//	MultipartValueString MultipartValueType = "string"
//	MultipartValueFile   MultipartValueType = "file"
//
// )
type ContentType string

const (
	contentTypeJson           ContentType = "application/json"
	contentTypeMultipartForm  ContentType = "multipart/form-data"
	contentTypeUrlEncodedForm ContentType = "application/x-www-form-urlencoded"
	contentTypeText           ContentType = "text/plain"
)

type Response struct {
	Body        string      `json:"body"`
	ContentType string      `json:"contentType"`
	StatusCode  int         `json:"statusCode"`
	Size        int         `json:"size"`
	Headers     http.Header `json:"headers"`
	DurationMs  int         `json:"durationMs"`
}

type multipartFormBody map[string]MultipartFormdataVal

type Service struct{}

func (s *Service) Send(opts Request) (*Response, error) {
	// construct query string from queryparams
	queryParams := url.Values{}
	for _, v := range opts.QueryParams {
		if v.Enabled {
			queryParams.Add(strings.TrimSpace(v.Name), strings.TrimSpace(v.Value))
		}
	}
	opts.Url = opts.Url + "?" + queryParams.Encode()

	headers := http.Header{}

	for _, v := range opts.Headers {
		headers.Add(v.Name, v.Value)
	}

	contentType := ContentType(opts.ContentType)

	if contentType != "" {
		headers.Set("Content-Type", string(contentType))
	}

	body := &bytes.Buffer{}
	bw := BodyWriter{RequestBody: opts.Body, ContentType: contentType}
	bw.Write(body)

	request, err := http.NewRequest(opts.Method, opts.Url, body)
	if err != nil {
		return nil, err
	}
	request.Header = headers

	start := time.Now()
	res, err := http.DefaultClient.Do(request)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	end := time.Now()

	payload, err := io.ReadAll(res.Body)
	if err != nil {
		log.Fatal(err)
	}

	return &Response{
		Body:        base64.StdEncoding.EncodeToString(payload),
		ContentType: res.Header.Get("Content-Type"),
		Size:        len(payload),
		StatusCode:  res.StatusCode,
		Headers:     res.Header.Clone(),
		DurationMs:  int(end.Sub(start).Milliseconds()),
	}, nil
}

type BodyWriter struct {
	RequestBody string
	ContentType
}

func (b *BodyWriter) Write(p *bytes.Buffer) error {

	if b.ContentType == contentTypeJson {
		_, err := p.Write([]byte(b.RequestBody))
		if err != nil {
			return err
		}
	} else if b.ContentType == contentTypeUrlEncodedForm {
		var body []NameValuePair
		err := json.Unmarshal([]byte(b.RequestBody), &body)
		if err != nil {
			return err
		}
		params := url.Values{}
		for _, kv := range body {
			params.Add(kv.Name, kv.Value)
		}
		queryString := params.Encode()
		_, err = p.Write([]byte(queryString))
		if err != nil {
			return err
		}
	} else if b.ContentType == contentTypeMultipartForm {
		var body multipartFormBody
		err := json.Unmarshal([]byte(b.RequestBody), &body)
		if err != nil {
			return err
		}
		multipartWriter := multipart.Writer{}
		boundary := fmt.Sprintf("curler-%d", time.Now().Unix())
		multipartWriter.SetBoundary(boundary)
		for k, v := range body {
			if v.ValueType == "text" {
				multipartWriter.WriteField(k, v.Value)
			} else if v.ValueType == "file" {
				h := textproto.MIMEHeader{}
				h.Set("Content-Disposition",
					fmt.Sprintf("form-data; name=%q; filename=%q", k, v.Filename))
				h.Set("Content-Type", v.MimeType)

				part, err := multipartWriter.CreatePart(h)
				if err != nil {
					return err
				}
				data, err := base64.StdEncoding.DecodeString(v.Value)
				if err != nil {
					return err
				}
				part.Write(data)
			}
		}
	}

	return nil
}
