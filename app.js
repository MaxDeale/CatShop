// APP CONFIG
var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("Body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
// CONNECT TO MONGOOSE
mongoose.connect("mongodb://localhost/CatShop", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// DATABASE SCHEMA CONFIG
var catSchema = new mongoose.Schema({
    catName: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});

var cat = mongoose.model("cat", catSchema);

// RESTFUL ROUTES

// INDEX ROUTE
app.get("/", function (req, res) {
    res.redirect("/cats");
});

app.get("/cats", function (req, res) {
    cat.find({}, function (err, cats) {
        if (err) {
            console.log("error");
        } else {
            res.render("index", {
                cats: cats
            });
        }

    });

});

// NEW ROUTE
app.get("/cats/new", function (req, res) {
    res.render("new");
});

// CREATE ROUTE
app.post("/cats", function (req, res) {
    req.body.cat.body = req.sanitize(req.body.cat.body)
    cat.create(req.body.cat, function (err, newCat) {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/cats");
        }
    })
});

// SHOW ROUTE

app.get("/cats/:id", function (req, res) {

    cat.findById(req.params.id, function (err, foundCat) {
        if (err) {
            res.redirect("/cats");
        } else {
            res.render("show", {
                cat: foundCat
            });
        }
    });
});


// EDIT ROUTE

app.get("/cats/:id/edit", function (req, res) {
    cat.findById(req.params.id, function (err, foundCat) {
        if (err) {
            res.redirect("/cats");
        } else {
            res.render("edit", {
                cat: foundCat
            });
        }
    });

});

// UPDATE ROUTE

app.put("/cats/:id", function (req, res) {
    cat.findByIdAndUpdate(req.params.id, req.body.cat, function (err, updatedCat) {
        if (err) {
            res.redirect("/cats");
        } else {
            res.redirect("/cats/" + req.params.id);
        }
    });
});

// DELETE ROUTE
app.delete("/cats/:id", function (req, res) {
    cat.findOneAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/cats");
        } else {
            res.redirect("/cats");
        }
    })
});


app.listen(process.env.PORT || 3000, function () {
    console.log("server is listening");
});