import express from "express";
import mongoose from "mongoose";
import {OCR} from "./models/ocrmodel.js";
import cors from "cors"
import Tesseract from 'tesseract.js';
import multer from "multer";
import 'dotenv/config';


const upload = multer({ dest: "uploads/" });

const mongoDBURL=process.env.URI;
const PORT=3000;


const app=express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});


app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const { path } = req.file;
    const result = await Tesseract.recognize(path, "eng");
    const text = result.data.text;

    console.log(text)


  //   Tesseract.recognize(data, 'eng', {
  //     logger: m => console.log(m)
  // }).then(({ data: { text } }) => {
  //     const labData = extractLabData(text);
  //     console.log(labData);     
  // }).catch(err => {
  //     console.error('Error during OCR:', err);
  // });

  const nameMatch = text.match(/Name:\s*([A-Za-z ]+)/);
  const rbsMatch = text.match(/RBS:\s*(\d+)\s*mg\/dl/);
  const bloodUreaMatch = text.match(/Blood Urea:\s*(\d+)\s*mg\/dl/);
  const sCreatinineMatch = text.match(/S\.Creatinine:\s*(\d+\.\d+)\s*mg\/dl/);
  const sCholesterolMatch = text.match(/S\.Cholesterol:\s*(\d+)\s*mg\/dl/);
  const sTGLMatch = text.match(/S\.TGL:\s*(\d+)\s*mg\/dl/);
  const sHDLMatch = text.match(/S\.HDL Cholesterol:\s*(\d+)\s*mg\/di/);
  const sLDLMatch = text.match(/S\.LDL Cholesterol:\s*(\d+)\s*mg\/dl/);
  const sGOT = text.match(/SGOT:\s*(\d+)\s*U\/L/);

  const details = {
    name: nameMatch ? nameMatch[1].trim() : null,
    RBS: rbsMatch ? parseInt(rbsMatch[1]) : null,
    BloodUrea: bloodUreaMatch ? parseInt(bloodUreaMatch[1]) : null,
    SCreatinine: sCreatinineMatch ? parseFloat(sCreatinineMatch[1]) : null,
    SCholesterol: sCholesterolMatch ? parseInt(sCholesterolMatch[1]) : null,
    STGL: sTGLMatch ? parseInt(sTGLMatch[1]) : null,
    SHDLCholesterol: sHDLMatch ? parseInt(sHDLMatch[1]) : null,
    SLDLCholesterol: sLDLMatch ? parseInt(sLDLMatch[1]) : null,
    SGOT: sGOT ? parseInt(sGOT[1]) : null,
};
console.log(details)
// let details=[]
// details.push(String(nameMatch));
// details.push(String(rbsMatch));
// details.push(String(bloodUreaMatch));
// details.push(String(sCreatinineMatch));
// details.push(String(sCholesterolMatch));
// details.push(String(sTGLMatch));
// details.push(String(sHDLMatch));
// details.push(String(sLDLMatch));
// details.push(String(sGOT));

let record = await OCR.findOne({ nameMatch: details.name });

if (record) {
  // Append new values to arrays
  const newrec = await OCR.updateOne(
    { _id: record._id },
    {
      $push: {
        rbsMatch: details.RBS,
        bloodUreaMatch: details.BloodUrea,
        sCreatinineMatch: details.SCreatinine,
        sCholesterolMatch: details.SCholesterol,
        sTGLMatch: details.STGL,
        sHDLMatch: details.SHDLCholesterol,
        sLDLMatch: details.SLDLCholesterol,
        sGot: details.SGOT,
      },
    }
  ).then((data)=>console.log(data));
  res.status(200).json({
    message: "Name exists. Appended new details.",
    data: newrec,
  });
} else {
  // Create a new record
  const newrecord = {
    nameMatch: [details.name], // Wrap in an array
    rbsMatch: [details.RBS],
    bloodUreaMatch: [details.BloodUrea],
    sCreatinineMatch: [details.SCreatinine],
    sCholesterolMatch: [details.SCholesterol],
    sTGLMatch: [details.STGL],
    sHDLMatch: [details.SHDLCholesterol],
    sLDLMatch: [details.SLDLCholesterol],
    sGot: [details.SGOT],
  };
  const newrec = await OCR.create(newrecord);
  res.status(201).json({
    message: "Name not found. Created new record.",
    data: newrec,
  });
}

} catch (err) {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
}
});



    // Perform OCR on the image
    


// app.get('/',(req,res) => {
//     console.log("I");  
// });

//  app.post('/',async (req,res) => {
//     try{
//         const newBook = {
//             title:req.body.title,
//             author:req.body.author,
//             publishYear:req.body.publishYear,
//         };
//         const book = await OCR.create(newBook);
//         return res.send(book);
//     }catch{
//         console.log(error);
//         res.send({message: error.message});
//     }
// });

mongoose.connect(mongoDBURL).then(()=>{
    console.log("done");
    app.listen(PORT, ()=>{
        console.log(`Listening to port ${PORT}`)
    })
}).catch((err)=>{
    console.log(err)
});

// function extractLabData(text) {
//   const nameMatch = text.match(/Name:\s*([A-Za-z ]+)/);
//   const rbsMatch = text.match(/RBS:\s*(\d+)\s*mg\/dl/);
//   const bloodUreaMatch = text.match(/Blood Urea:\s*(\d+)\s*mg\/dl/);
//   const sCreatinineMatch = text.match(/S\.Creatinine:\s*(\d+\.\d+)\s*mg\/dl/);
//   const sCholesterolMatch = text.match(/S\.Cholesterol:\s*(\d+)\s*mg\/dl/);
//   const sTGLMatch = text.match(/S\.TGL:\s*(\d+)\s*mg\/dl/);
//   const sHDLMatch = text.match(/S\.HDL Cholesterol:\s*(\d+)\s*mg\/di/);
//   const sLDLMatch = text.match(/S\.LDL Cholesterol:\s*(\d+)\s*mg\/dl/);
//   const sGOT = text.match(/SGOT:\s*(\d+)\s*U\/L/);
//   // SGPT: /SGPT:\s*(\d+\.?\d*)\s*U\/L/,
//   // SNa: /S\.Na\+:\s*(\d+\.?\d*)\s*mmollL/,
//   // SK: /S\.K\+:\s*(\d+\.?\d*)\s*mmollL/,
//   // HbA1c: /HbA1c:\s*(\d+\.?\d*)%/,
//   // HB: /HB:\s*(\d+\.?\d*)\s*g\/dl/,
//   // TC: /TC:\s*(\d+\.?\d*)\s*\/cumm/,
//   // Poly: /Poly:\s*(\d+\.?\d*)%/,
//   // Lymph: /Lymph:\s*(\d+\.?\d*)%/,
//   // Eosin: /Eosin:\s*(\d+\.?\d*)%/,
//   // Platelet: /Platelet:\s*(\d+\.?\d*)\s*\/lakh/

//   // Create JSON object


//   return result;
// }