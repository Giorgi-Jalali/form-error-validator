## AS IS
An application based on `create-react-app` which consists of one page. The page contains a form with various fields. The following fields: `text`, `email`, `select`, `number` are required. There should be 10 fields in total. The form can save itself on the `server` by clicking on the `Submit` button. The form must be implemented in pure react, without using libraries such as `formik`

## TO DO
Write a validator for front-end and back-end form validation. Front-end validations should work before sending the data to the server. In case of a validation error(s), sending data to the server should be blocked, and the corresponding messages should be displayed under the corresponding field in the form. Back-end validations are triggered on the server side, and in case of an error, it sends an appropriate response with a list of fields and errors. The task of the front-end is to process such a response and display the correct messages under the appropriate fields.

## Technical requirements

### Basic requirements

1. It is forbidden to remove any existing files. However, it is allowed to create new files inside the `src` directory.
2. The project is configured with `prettier` and` eslint`. The code must pass all eslint checks and must be formatted according to the settings in `.perttierrc`. Solutions that do not meet this requirement will be eliminated automatically, and their performance will not be checked. It is also forbidden to use the `eslint-disable- *` directives.
3. The compiled version of the app will be checked, so the candidate needs to make sure that the build works (`npm run build`,` npm start`).
4. Dev mode is started by the command `npm run dev`.
5. It is forbidden to use any third-party libraries. All code should be written in "clean" react. For requests to the "server", `fetch` will be used.

### Task Requirements

1. All inputs in the form have a "name". The name is used to manipulate the `value` within the input. Also, the name must be used to map errors to the specific input in which the error occurred. Errors should be displayed under the input in the container
   ```html 
   <div className = "error_container"> ... </div>
   ```
2. Each error should be displayed as
   ```html 
    <span className = "error_message"> Some error text </span>
   ```
3. There can be more than one error for one input.
4. If the front-end validation fails, the submit button must be disabled via the disabled property.
5. After successfully submitting the request, the form should be completely cleared. After clearing the form, no errors should be displayed.
6. The set of rules for validation is stored in the file `/ src / validations / formValidation.js`. In a merge request, this file should not be changed, however, when checking the task, the reviewer can change the file, creating another set of rules to check the correctness of the form in general.

### Formats of the response from the "server"

1. If there are no errors, the server will return the status `201`
2. If there are errors, the server will return the status `400` and the response in the following format:

```javascript
{
  generalError ?: [{message: String}],
  [fieldName: String] ?: [{ message: String }]
}
```

### Front-end validation rules

Validation rules can be displayed in 2 ways - by pressing the submit button and by blur. The property `validateOn` is responsible for this, which can be either` blur` or `submit`, respectively.

Possible validation rules (defined by the `rules` field):

1.`required`. The field must contain something. 2. `email`. An email must be entered in the field (format `a @ b` where` a` and `b` can be any digital-alphabetic characters and` .`) any length. 3. `minLength` /` maxLength` limit on the minimum / maximum number of characters in the field. Within the framework of this task, if the input has both of these rules, `minLength` will always be strictly less than` maxLength`. The rule applies only to inputs of the type `text` and is guaranteed not to be checked on inputs of the other types 4. `min` /` max` The rule applies only to inputs of the type `number` and is guaranteed not to be checked on inputs of other types. Determines the minimum and maximum value in this input. Within the framework of the task, if the input has both rules at once, then `min` will always be strictly less than` max`. 5. In case of an error, the message from the `message` field should be displayed

An example of a validation rule:

```javascript
export const fromValidation = [
{
  inputName: "firstName",
  rules: [
    {type: "required", message: "the field is required"},
   {type: "minLength", value: 3, message: "to few symbols"},
  ],
  validateOn: "submit",
},
{
  inputName: "email",
  rules: [
    {type: "email", message: "incorrect format"},
    {type: "required", message: "required"},
  ],
  validateOn: "submit",
},
{
  inputName: "age",
  rules: [{type: "min", value: 18, message: "to young"}],
  validateOn: "blur",
},
];
```

There may be a situation when there are no validation rules for one or several inputs in the form. Then for such inputs there will be no object in the `formValidation` array.
