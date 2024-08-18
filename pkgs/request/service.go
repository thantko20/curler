package request

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"time"
)

// type MultipartValueType string

// const (
// 	MultipartValueString MultipartValueType = "string"
// 	MultipartValueFile   MultipartValueType = "file"
// )
// const (
// 	bodyTypeJson           RequestBodyType = "json"
// 	bodyTypeMultipartForm  RequestBodyType = "multipart/form-data"
// 	bodyTypeUrlEncodedForm RequestBodyType = "x-www-form-urlencoded"
// 	bodyTypeText           RequestBodyType = "text"
// )

type Response struct {
	Body        string      `json:"body"`
	ContentType string      `json:"contentType"`
	StatusCode  int         `json:"statusCode"`
	Size        int         `json:"size"`
	Headers     http.Header `json:"headers"`
	DurationMs  int         `json:"durationMs"`
}

type Service struct{}

func (s *Service) Send(opts Request) (*Response, error) {
	body := &bytes.Buffer{}
	request, err := http.NewRequest(opts.Method, opts.Url, body)
	if err != nil {
		return nil, err
	}
	for k, v := range opts.Headers {
		request.Header.Set(k, v)
	}
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
		Body:        string(payload),
		ContentType: res.Header.Get("Content-Type"),
		Size:        int(res.ContentLength),
		StatusCode:  res.StatusCode,
		Headers:     res.Header.Clone(),
		DurationMs:  int(end.Sub(start).Milliseconds()),
	}, nil
}
