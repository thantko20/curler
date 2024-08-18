package curler_test

import (
	"bytes"
	"fmt"
	"testing"

	"github.com/thantko20/curler/curler"
)

// func TestCurl(t *testing.T) {

// 	t.Run("simple get request", func(t *testing.T) {
// 		want := "hello world"
// 		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 			fmt.Fprint(w, want)
// 		}))
// 		defer server.Close()

// 		opts := curler.RequestOptions{
// 			Method: http.MethodGet,
// 			Headers: map[string]string{
// 				"Content-Type": "text",
// 			},
// 			Url: server.URL,
// 		}

// 		res, err := curler.Send(opts)
// 		if err != nil {
// 			t.Fatal(err)
// 		}
// 		if res.Body != "hello world" {
// 			t.Errorf("want %q got %q", "hello world", res.Body)
// 		}
// 	})

// 	t.Run("get response content type correctly", func(t *testing.T) {
// 		want := `{"name":"John Doe"}`
// 		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 			w.Header().Set("Content-Type", "application/json")
// 			fmt.Fprint(w, want)
// 		}))
// 		defer server.Close()
// 		opts := curler.RequestOptions{
// 			Method: http.MethodGet,
// 			Url:    server.URL,
// 		}
// 		res, err := curler.Send(opts)
// 		if err != nil {
// 			t.Fatal(err)
// 		}
// 		if res.Body != want {
// 			t.Errorf("wanted response body %q got %q", want, res.Body)
// 		}
// 		if res.ContentType != "application/json" {
// 			t.Errorf("wanted response content type %q, got %q", "application/json", res.ContentType)
// 		}

// 	})

// }

func TestWriteMultipartForm(t *testing.T) {
	body := curler.BodyMultipartForm{
		"name": curler.BodyMultipartFormValueInfo{
			ValueType: curler.MultipartValueString,
			Value:     "John Doe",
		},
		"age": curler.BodyMultipartFormValueInfo{
			ValueType: curler.MultipartValueString,
			Value:     "30",
		},
		"profile_pic": curler.BodyMultipartFormValueInfo{
			ValueType: curler.MultipartValueFile,
			Value:     "YmFzZTY0IGVuY29kZWQgc3RyaW5n",
			Filename:  "profile.jpg",
			MimeType:  "image/jpeg",
		},
	}

	result := bytes.Buffer{}
	curler.WriteMultipartBody(body, &result, "")
	fmt.Println(result.String())
}
