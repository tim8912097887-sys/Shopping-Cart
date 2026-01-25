import { responseEnvelope } from "./responseEnvelope.js"

describe("ResponseEnvelope Unit Test",() => {

    it('When provide with just data property,the error in Response structure should be null', () => {
        const successResponse = responseEnvelope("success",{
            data: {
                accessToken: "accessToken"
            }
        });
        // Assertion
        expect(successResponse.error).toBeNull();
        expect(successResponse.data?.accessToken).toBe("accessToken");
    })

    it('When provide with just error property,data in Response structure should be null', () => {
        const errorResponse = responseEnvelope("error",{
            error: {
                status: 500,
                detail: "Server Error"
            }
        });
        // Assertion
        expect(errorResponse.data).toBeNull();
        expect(errorResponse.error?.detail).toBe("Server Error");
    })
})