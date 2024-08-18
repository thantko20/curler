package curler

import (
	"bytes"
	"io"
	"log"
	"net/http"
)

type MultipartValueType string

const (
	MultipartValueString MultipartValueType = "string"
	MultipartValueFile   MultipartValueType = "file"
)

type RequestBody map[string]interface{}

type BodyJson map[string]interface{}

type BodyMultipartFormValueInfo struct {
	ValueType MultipartValueType `json:"valueType"`
	Value     string             `json:"value"`
	MimeType  string             `json:"mimeType"`
	Filename  string             `json:"filename"`
}

type BodyMultipartForm map[string]BodyMultipartFormValueInfo

type BodyUrlEncodedForm map[string]string

type RequestBodyType string

const (
	bodyTypeJson           RequestBodyType = "json"
	bodyTypeMultipartForm  RequestBodyType = "multipart/form-data"
	bodyTypeUrlEncodedForm RequestBodyType = "x-www-form-urlencoded"
	bodyTypeText           RequestBodyType = "text"
)

type BodyInfo struct {
	Body               RequestBody `json:"body"`
	BodyJson           `json:"bodyJson"`
	BodyMultipartForm  `json:"bodyMultipartForm"`
	BodyUrlEncodedForm `json:"bodyUrlEncodedForm"`
	BodyType           RequestBodyType `json:"bodyType"`
}

type RequestOptions struct {
	Method   string            `json:"method"`
	Headers  map[string]string `json:"headers"`
	Url      string            `json:"url"`
	BodyInfo `json:"bodyInfo"`
}

type CurlerResponse struct {
	Body        interface{} `json:"body"`
	ContentType string      `json:"contentType"`
	StatusCode  int         `json:"statusCode"`
	Size        int         `json:"size"`
}

func Send(opts RequestOptions) (CurlerResponse, error) {
	log.Printf("%v", opts.BodyInfo.Body)
	body := &bytes.Buffer{}
	WriteRequestBody(opts.BodyInfo, body)

	contentType, ok := opts.Headers["Content-Type"]
	if !ok {
		contentType = "application/json"
	}

	request, err := http.NewRequest(opts.Method, opts.Url, body)
	if err != nil {
		return CurlerResponse{}, err
	}
	request.Header.Set("Content-Type", contentType)
	res, err := http.DefaultClient.Do(request)
	if err != nil {
		return CurlerResponse{}, err
	}
	defer res.Body.Close()
	payload, err := io.ReadAll(res.Body)
	if err != nil {
		log.Fatal(err)
	}

	return CurlerResponse{
		Body:        payload,
		ContentType: res.Header.Get("Content-Type"),
		Size:        len(payload),
		StatusCode:  res.StatusCode,
	}, nil
}

func WriteRequestBody(bodyInfo BodyInfo, w io.Writer) error {
	if bodyInfo.BodyType == bodyTypeJson {
		if err := WriteJsonBody(bodyInfo.BodyJson, w); err != nil {
			return err
		}
	} else if bodyInfo.BodyType == bodyTypeMultipartForm {
		if err := WriteMultipartBody(bodyInfo.BodyMultipartForm, w, ""); err != nil {
			return err
		}
	} else if bodyInfo.BodyType == bodyTypeUrlEncodedForm {
		if err := WriteUrlEncodedBody(bodyInfo.BodyUrlEncodedForm, w); err != nil {
			return err
		}
	}
	return nil
}
