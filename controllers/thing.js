const Thing = require("../models/thing");
const fs = require("fs");

const getOneThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => {
      console.log("Object retrieved from MongoDB successfully!");
      res.status(200).json(thing);
    })
    .catch((error) => res.status(404).json({ error }));
};

const getAllThings = (req, res, next) => {
  Thing.find({})
    .then((things) => {
      console.log("Objects retrieved from MongoDB successfully!");
      res.status(200).json(things);
    })
    .catch((error) => res.status(400).json({ error }));
};

const updateOneThing = (req, res, next) => {
  const thingObject = req.file
    ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };
  delete thingObject._userId; // Ensure that the client cannot set the _userId field, as it will be set from the authenticated user.

  Thing.findOne({ _id: req.params.id })
    .then((thing) => {
      if (thing.userId !== req.auth.userId) {
        return res.status(403).json({ error: "Unauthorized request!" });
      } else {
        const oldfilename = thing.imageUrl.split("/images/")[1];
        fs.unlink(`images/${oldfilename}`, () => {
          console.log("Image deleted from local files successfully!");
        });
        console.log("Hi BOss");

        Thing.updateOne(
          { _id: req.params.id },
          { ...thingObject, _id: req.params.id },
        )
          .then(() => {
            console.log("Object updated in MongoDB successfully!");
            res.status(200).json({ message: "Objet updated !" });
          })
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

const deleteOneThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => {
      if (thing.userId != req.auth.userId) {
        res.status(403).json({ error: "Unauthorized request!" });
      } else {
        const filename = thing.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Thing.deleteOne({ _id: req.params.id })
            .then(() => {
              console.log("Object deleted from MongoDB successfully!");
              res.status(200).json({ message: "Objet deleted !" });
            })
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

const createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.thing);
  delete thingObject._id; // Ensure that the client cannot set the _id field, as MongoDB will generate it automatically.
  delete thingObject._userId; // Ensure that the client cannot set the _userId field, as it will be set from the authenticated user.

  const newThing = new Thing({
    ...thingObject,
    userId: req.auth.userId, // Set the userId from the authenticated user
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`, // Construct the image URL based on the request data
  });

  newThing
    .save()
    .then(() => {
      console.log("Objet saved to MongoDB successfully!");
      res.status(201).json({ message: "Objet created !" });
    })
    .catch((error) => res.status(400).json({ error }));
};

module.exports = {
  createThing,
  getOneThing,
  getAllThings,
  updateOneThing,
  deleteOneThing,
};
