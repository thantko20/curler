package curler

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/textproto"
)

func WriteMultipartBody(body BodyMultipartForm, w io.Writer, boundary string) error {
	writer := multipart.NewWriter(w)
	if boundary != "" {
		writer.SetBoundary(boundary)
	}
	for key, value := range body {
		if value.ValueType == MultipartValueFile {
			header := make(textproto.MIMEHeader)
			header.Set("Content-Disposition",
				fmt.Sprintf("form-data; name=%q; filename=%q", key, value.Filename))
			header.Set("Content-Type", value.MimeType)

			part, err := writer.CreatePart(header)
			if err != nil {
				return err
			}
			fileData, err := base64.StdEncoding.DecodeString(value.Value)
			if err != nil {
				return err
			}
			log.Println(fileData)
			_, err = part.Write(fileData)
			if err != nil {
				return err
			}
		} else if value.ValueType == MultipartValueString {
			part, err := writer.CreateFormField(key)
			if err != nil {
				return err
			}
			_, err = part.Write([]byte(value.Value))
			if err != nil {
				return err
			}
		}
	}
	writer.Close()
	return nil
}

func WriteJsonBody(body BodyJson, w io.Writer) error {
	jsonString, err := json.Marshal(body)
	if err != nil {
		return err
	}
	_, err = w.Write(jsonString)
	if err != nil {
		return err
	}
	return nil
}

func WriteUrlEncodedBody(body BodyUrlEncodedForm, w io.Writer) error {
	for key, value := range body {
		_, err := w.Write([]byte(key + "=" + value))
		if err != nil {
			return err
		}
	}
	return nil
}
