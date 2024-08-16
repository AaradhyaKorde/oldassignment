const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 4500;

// app.use(cors({
//   origin: 'https://www.ok7technicalservices.com'
// }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use(express.json());

//Database
mongoose.connect('mongodb+srv://ok7technicalservices:mNjzS3Rw0T3p7DGY@cluster0.qfhw35c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

const careerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  mobile: String,
  role: String,
  resumeLink: String
});
const enquirySchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  mobile: String,
  company: String,
});

const Career = mongoose.model('Career-Pitchhme', careerSchema);
const Enquiry = mongoose.model('Enquiry-Pitchhme', enquirySchema);



//Create

const uploadDirectory = 'uploads';
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}


//Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory + '/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });


app.get("/",(req, res) =>{res.json("Pitchhme")})

app.get("/demandEnquiry", async (req, res)=>{
  const blah = await Enquiry.find({});
  res.json(blah);
})
app.get("/demandCareer", async (req, res)=>{
  const blah = await Career.find({});
  res.json(blah);
})

//api for career form

app.post('/api/save-career', upload.single('resume'), async (req, res) => {

  if(req.body.company){
    try {
      const { firstName, lastName, email, mobile, company } = req.body;
      console.log(req.body);
      
  
      // Create a new Details object
      const newDetails = new Enquiry({ firstName, lastName, email, mobile, company });
  
      // Save the details to the database
      await newDetails.save();
  
      // Respond with success message
      res.json({ message: 'Details saved successfully', data: req.body });
    } catch (error) {
      // Handle errors
      console.error('Error saving details:', error);
      return res.status(500).json({ message: 'An error occurred while saving details' });
    }
  } else{
  try {
    const { firstName, lastName, email, mobile, role } = req.body;

    // Check if file is uploaded
    if (req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get the file path
    const resumeLink = req.file.path;

    // Create a new Details object
    const newDetails = new Career({ firstName, lastName, email, mobile, role, resumeLink });

    // Save the details to the database
    await newDetails.save();

    // Respond with success message
    res.json({ message: 'Details saved successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error saving details:', error);
    return res.status(500).json({ message: 'An error occurred while saving details' });
  }}
});

// app.post('/api/save-enquiry', async (req, res) => {
//   try {
//     const { firstName, lastName, email, mobile, role } = req.body;
//     console.log(req.body);
    

//     // Create a new Details object
//     const newDetails = new Enquiry({ firstName, lastName, email, mobile, role });

//     // Save the details to the database
//     await newDetails.save();

//     // Respond with success message
//     res.json({ message: 'Details saved successfully', data: req.body });
//   } catch (error) {
//     // Handle errors
//     console.error('Error saving details:', error);
//     return res.status(500).json({ message: 'An error occurred while saving details' });
//   }
// });

app.get('/get-career',async(req,res) => {
  const data = await Career.find({});
  return res.json(data);
})
app.get('/get-enquiry',async(req,res) => {
  const data = await Enquiry.find({});
  return res.json(data);
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});