import { http, HttpResponse } from "msw"

export const handler = [
    http.post("http://localhost:3000/auth/login",({ request }) => {
        return HttpResponse.json({
            state: "success",
            error: null,
            data: {
                accessToken: "accessToken",
                user: {
                   _id: 1,
                   username: "mockUsername",
                   email: request.body?.email,
                   isAdmin: false
                }
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        },{
            status: 200
        })
    }),
    http.post("http://localhost:3000/auth/signup",({ request }) => {
        return HttpResponse.json({
            state: "success",
            error: null,
            data: {
                user: {
                   _id: 1,
                   username: "mockUsername",
                   email: request.body?.email,
                   isAdmin: false
                }
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        },{
            status: 201
        })
    }),
]