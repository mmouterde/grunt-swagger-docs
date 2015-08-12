
/**
 * @SwaggerHeader
 * info:
 *   title: Swagger Sample App
 *   description: This is a sample server Petstore server.
 *   termsOfService: http://swagger.io/terms/
 *   contact:
 *     name: API Support
 *     url: http://www.swagger.io/support
 *     email: support@swagger.io
 *   license:
 *     name: Apache 2.0
 *     url: http://www.apache.org/licenses/LICENSE-2.0.html
 *   version: 1.0.1
 * host: localhost:8090
 * basePath: /
 * consumes:
 *   - application/json
 * produces:
 *   - application/json
 * tags:
 *   - name: pet
 *     description: Everything about your Pets
 *     externalDocs:
 *       description: Find out more
 *       url: http://swagger.io
 *   - name: other tag
 * @SwaggerTag
 *   test:
 *     description: just another test
 */
module.exports = function (router) {
    /**
     * @SwaggerPath
     *   /:
     *     get:
     *       summary: just a test route
     *       description: nothing to see here
     *       tags:
     *         - test
     *         - pet
     *       consumes:
     *         - application/json
     *       produces:
     *         - application/json
     *       responses:
     *         200:
     *           description: successful operation
     *           schema:
     *             $ref: "#/definitions/ApiResponse"
     */
    router.get('/', function (req, res) {
        res.json(+new Date());
    });

    /**
     * @SwaggerPath
     *   /{id}:
     *     get:
     *       summary: just a test route
     *       description: nothing to see here
     *       tags:
     *         - test
     *       consumes:
     *         - application/json
     *       produces:
     *         - application/json
     *       parameters:
     *         - name: id
     *           in: path
     *           description: just an ID
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: successful operation
     *           schema:
     *             $ref: "#/definitions/ApiResponse"
     */
    router.get('/:id', function (req, res) {
        res.json(+new Date());
    });

    /**
     * @SwaggerPath
     *   /:
     *     post:
     *       summary: just a test route
     *       description: nothing to see here
     *       tags:
     *         - test
     *       consumes:
     *         - application/json
     *       produces:
     *         - application/json
     *       responses:
     *         200:
     *           description: successful operation
     *           schema:
     *             $ref: "#/definitions/ApiResponse"
     */
    router.post('/', function (req, res) {
        res.json(+new Date());
    });


    /**
     * @SwaggerDefinitions
     *   ApiResponse:
     *     type: object
     *     properties:
     *       code:
     *         type: integer
     *         format: int32
     *       type:
     *         type: string
     *       message:
     *         type: string
     */
};
