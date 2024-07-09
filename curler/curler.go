package curler

import (
	"io"
	"log"
	"net/http"
)

type RequestOptions struct {
	Method  string            `json:"method"`
	Headers map[string]string `json:"headers"`
	Url     string            `json:"url"`
	Body    interface{}       `json:"body"`
}

type Response struct {
	Body        interface{} `json:"body"`
	ContentType string      `json:"contentType"`
	StatusCode  int         `json:"statusCode"`
}

func Curl(opts RequestOptions) (Response, error) {
	request, err := http.NewRequest(opts.Method, opts.Url, nil)
	if err != nil {
		return Response{}, err
	}
	contentType, ok := opts.Headers["Content-Type"]
	if !ok {
		contentType = "application/json"
	}
	request.Header.Set("Content-Type", contentType)
	res, err := http.DefaultClient.Do(request)
	if err != nil {
		return Response{}, err
	}
	defer res.Body.Close()
	payload, err := io.ReadAll(res.Body)
	if err != nil {
		log.Fatal(err)
	}
	return Response{
		Body:        string(payload),
		ContentType: res.Header.Get("Content-Type"),
		StatusCode:  res.StatusCode,
	}, nil
}
