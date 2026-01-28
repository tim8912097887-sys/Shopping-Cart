
/**
 * @swagger
 * components:
 *  schemas:
 *   MetaObject:
 *    type: object
 *    properties:
 *     timestamp: 
 *      type: string
 *      format: date-time
 *      example: "2026-01-27T11:59:14.509Z"
 *   ErrorObject:
 *    type: object
 *    properties:
 *     status: 
 *      type: integer
 *     detail:
 *      type:
 *       string
 *   ReturnUser:
 *    type: object
 *    properties:
 *     __v: 
 *      type: integer
 *     _id: 
 *      type: string
 *     username: 
 *      type: string
 *     email:
 *      type: string
 *     isAdmin:
 *      type: boolean
 *     loginAttempts:
 *      type: integer
 *     loginUtils:
 *      type: integer
 *     createAt: 
 *      type: string
 *      format: date-time
 *     updatedAt:
 *      type: string
 *      format: date-time
 *    example: 
 *     _id: sodfjoewjfowie
 *     username: lbj
 *     email: lbj@email.com
 *     isAdmin: false
 *     loginAttempts: 0
 *     loginUtils: -1
 *     createAt: 2026-01-27T12:03:09.241Z
 *     updatedAt: 2026-01-27T12:03:09.241Z
 *  responses:
 *   SuccessCreateResponse:
 *    $ref: "#/components/responses/SuccessResponse"
 *   SuccessResponse:
 *    allOf:
 *     - $ref: "#/components/responses/Response"
 *     - type: object
 *       properties:
 *        status: 
 *         example: success
 *        error: 
 *         example: null
 *   Response:
 *    type: object
 *    properties:
 *     status: 
 *      type: string
 *      enum: [success,error]
 *     error: 
 *      $ref: "#/components/schemas/ErrorObject"
 *      nullable: true
 *     data: 
 *      $ref: "#/components/schemas/ReturnUser"
 *      nullable: true
 *     meta:
 *      $ref: "#/components/schemas/MetaObject"
 *    
 */