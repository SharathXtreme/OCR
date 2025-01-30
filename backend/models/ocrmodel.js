import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ocrSchema = new Schema({
    nameMatch:{type:[String]},
    rbsMatch:{type:[Number]},
    bloodUreaMatch:{type:[Number]},
    sCreatinineMatch:{type:[Number]},
    sCholesterolMatch:{type:[Number]},
    sTGLMatch:{type:[Number]},
    sHDLMatch:{type:[Number]},
    sLDLMatch:{type:[Number]},
    sGot:{type:[Number]},

});

export const OCR = mongoose.model('OCR',ocrSchema);