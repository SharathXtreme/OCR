import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ocrSchema = new Schema({
    nameMatch:{type:String},
    rbsMatch:{type:Array},
    bloodUreaMatch:{type:Array},
    sCreatinineMatch:{type:Array},
    sCholesterolMatch:{type:Array},
    sTGLMatch:{type:Array},
    sHDLMatch:{type:Array},
    sLDLMatch:{type:Array},
    sGot:{type:Array},

});

export const OCR = mongoose.model('OCR',ocrSchema);