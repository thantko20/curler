package curler

import (
	"io"
	"net/http"
)

type RequestOptions struct {
	Method  string
	Headers map[string]string
	Url     string
	Body    interface{}
}

type Response struct {
	Body        interface{}
	ContentType string
	StatusCode  int
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
	return Response{
		Body:        string(payload),
		ContentType: res.Header.Get("Content-Type"),
		StatusCode:  res.StatusCode,
	}, nil
}
