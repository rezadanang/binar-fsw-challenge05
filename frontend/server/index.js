const express = require("express");
const path = require("path");
const axios = require('axios'); 
const uploadOnMemory = require("../uploadOnMemory");
const cloudinary = require("../cloudinary");

const app = express();
const PORT = 8000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))

app.use(express.json());



app.get('/', async (req, res) => {
  try {
      const cars = await axios.get('http://localhost:8001/cars/');
      res.render('index', cars.data)
  } catch (err) {
      res.status(500).json(err)
  }
})

app.get('/add-cars', (req, res) => {
  res.render('add-cars')
})
app.get('/update-cars', (req, res) => {
    res.render('update-cars')
  })

app.post(
    "/add-cars",
    uploadOnMemory.single("foto"),
    (req, res) => {
        const fileBase64 = req.file.buffer.toString("base64");
        const file = `data:${req.file.mimetype};base64,${fileBase64}`;

        cloudinary.uploader.upload(file, { folder: 'coba' }, async function (err, result) {
            if (!!err) {
                console.log(err);
                return res.status(400).json({
                    message: "Gagal upload file!",
                });
            }

            const body = req.body;
            body.foto = result.url;
            try {
                const cars = await axios.post('http://localhost:8001/cars', body);
                return res.redirect("/")
            } catch (err) {
                return res.status(500).json(err)
            }
        });
    }
);

app.get('/update-cars/:id', async (req, res) => {
  try {
      const id = req.params.id;

      const cars = await axios.get(`http://localhost:8001/cars/${id}`);
      res.render('update-cars', cars.data)
  } catch (err) {
      res.status(500).json(err)
  }
})

app.post(
"/update-cars/:id", uploadOnMemory.single("foto"), (req, res) => {
      const fileBase64 = req.file.buffer.toString("base64");
      const file = `data:${req.file.mimetype};base64,${fileBase64}`;

      cloudinary.uploader.upload(file, { folder: 'test' }, async function (err, result) {
          if (!!err) {
              console.log(err);
              return res.status(400).json({
                  message: "Gagal upload file!",
              });
          }

          const id = req.params.id;
          const body = req.body;
          body.foto = result.url;
          try {
              const cars = await axios.put(`http://localhost:8001/cars/${id}`, body);
              return res.redirect("/")
          } catch (err) {
              return res.status(500).json(err)
          }
      });
  }
);

app.get('/delete-cars/:id', async (req, res) => {
  try {
      const id = req.params.id;
      const cars = await axios.delete(`http://localhost:8001/cars/${id}`);
      res.redirect("/")
  } catch (err) {
      res.status(500).json(err)
  }
})

app.listen(PORT, () => {
  console.log(`Express nyala di http://localhost:${PORT}`);
});


// app.get("/", (req, res) => {
//   // res.status(200);
//   // res.sendFile(path.join(PUBLIC_DIRECTORY, "index.html"));
//   res.render("index", {});
// });

// // app.get("/index", (req, res) => {
// //   // res.status(200);
// //   // res.sendFile(path.join(PUBLIC_DIRECTORY, "index.html"));
// //   res.render("index", {});
// // });

// app.get("/add-cars", (req, res) => {
//   // res.status(200);
//   // res.sendFile(path.join(PUBLIC_DIRECTORY, "index.html"));
//   res.render("add-cars", {});
// });

// app.get("/update-cars", (req, res) => {
//   // res.status(200);
//   // res.sendFile(path.join(PUBLIC_DIRECTORY, "index.html"));
//   res.render("update-cars", {});
// });

// // app.get("/cars", (req, res) => {
// //   // res.status(200);
// //   // res.sendFile(path.join(PUBLIC_DIRECTORY, "sewa.html"));
// //   res.render("sewa", {});
// // });

// app.use("/", (req, res) => {
//   res.render("error", {});
// });

// app.listen(PORT, () => {
//   console.log("Berhasil! Silahkan akses http://localhost:%d", PORT);
// });