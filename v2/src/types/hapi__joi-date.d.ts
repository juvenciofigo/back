declare module "mongoose-unique-validation" {
    import { Schema } from "mongoose";
    function uniqueValidator(schema: Schema, options?: { message?: string }): void;
    export = uniqueValidator;
  }