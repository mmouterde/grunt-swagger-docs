# Grunt Swagger Docs
Generates swagger docs from JSDocs comments in JavaScript files.

This module is based on [express-swagger-docs](https://github.com/enigmamarketing/express-swagger-docs) but modified to be used as a grunt task.

It only supports [version 2.0](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md) of the [swagger](http://swagger.io/) specification.

The generated Swagger Document is transparently validated using the [swagger-tools](https://github.com/apigee-127/swagger-tools) validator and will output a errors in case it doesn't validate against the spec.

## Current (known) Limitations

- External $ref resources are not supported, only internal definitions. eg. $ref: #/definitions/Tag
- Only .js files are parsed
- HTML version doesn't expose all options


## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-swagger-docs --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-swagger-docs');
```

### Usage

Example:
```js
'swagger-docs': {
      dev:{
          src: ['app/**/*.js', '!app/**/*.spec.js'],
          dest: 'app/swagger.json',
          versionFile: 'package.json' // Optional. If a valid json file, the `version` will be read from here.
      }
  },
},
```

### Write JSDoc
We can write these sections:

- @SwaggerHeader
- @SwaggerTag
- @SwaggerPath
- @SwaggerDefinitions

#### @SwaggerHeader
Only the **info.title** property is mandatory. There can be more than one instance of the swagger header definition, properties will be overwritten. There is no pre-defined order by which the properties will be merged.

Usually this is placed in the same file we have our home route (**/**), but it's really up to you.

If versionFile is a JSON file (usually package.json), the version number will be read from there. Otherwise, **info.version** is required as well.

```
/**
 * @SwaggerHeader
 * info:
 *   title: Swagger Sample App
 *   version: 1.0.0
 */
```

But you may define any additional properties

```
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
 *   version: 1.0.0
 * host: localhost:8090
 * basePath: /
 * tags:
 *   - name: pet
 *     description: Everything about your Pets
 *     externalDocs:
 *       description: Find out more
 *       url: http://swagger.io
 *   - name: other tag
 */
```

#### @SwaggerTag
We don't need to define the tags array in the @SwaggerHeader. These definitions can be distributed across the files and the plugin will merge them into the tags array. Once again, duplications will be merged in no particular order.

```
/**
 * @SwaggerTag
 * pet:
 *  description: Everything about your Pets
 *  externalDocs:
 *    description: Find out more
 *    url: http://swagger.io
 */
```

#### @SwaggerPath
There will be multiple definitions of this block, one per each exposed express handler you wish do document as a REST endpoint. Usually, we place them right before the method they are describing, but it really doesn't matter where you place them.

```
/**
* @SwaggerPath
*   /login:
*     get:
*       summary: just a test route
*       description: nothing to see here
*       tags:
*         - login
*       consumes:
*         - application/json
*       produces:
*         - application/json
*/
exports.login = function (req, res) {
  var user = {};
  user.username = req.param('username');
  user.password = req.param('password');

  // just a fake example...
  res.json(user);
}
```

#### @SwaggerDefinitions
Definitions may be defined in the @SwaggerHeader but you can also define them in the document where they are used. As before, duplications will be merged in no particular order.

```
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
```

