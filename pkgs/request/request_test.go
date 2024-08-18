package request_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/thantko20/curler/pkgs/request"
)

func TestSend(t *testing.T) {
	tests := []struct {
		name           string
		serverResponse func(w http.ResponseWriter, r *http.Request)
		request        request.Request
		wantStatusCode int
		wantErr        bool
		wantBody       string
	}{
		{
			name: "Successful GET request",
			serverResponse: func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(http.StatusOK)
				w.Write([]byte(`{"message": "success"}`))
			},
			request: request.Request{
				Method: http.MethodGet,
				Url:    "/test",
			},
			wantStatusCode: http.StatusOK,
			wantErr:        false,
			wantBody:       `{"message": "success"}`,
		},
		{
			name: "Server error",
			serverResponse: func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(http.StatusInternalServerError)
			},
			request: request.Request{
				Method: http.MethodGet,
				Url:    "/error",
			},
			wantStatusCode: http.StatusInternalServerError,
			wantErr:        false,
			wantBody:       "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			server := httptest.NewServer(http.HandlerFunc(tt.serverResponse))
			defer server.Close()

			s := &request.Service{}
			tt.request.Url = server.URL + tt.request.Url

			got, err := s.Send(tt.request)

			if (err != nil) != tt.wantErr {
				t.Errorf("Service.Send() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if got.Body != tt.wantBody {
				t.Errorf("Service.Send() Body = %v, want %v", got.Body, tt.wantBody)
			}

			if got.StatusCode != tt.wantStatusCode {
				t.Errorf("Service.Send() StatusCode = %v, want %v", got.StatusCode, tt.wantStatusCode)
			}
		})
	}
}
