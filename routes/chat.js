var express = require("express");
const Joi = require("joi");
var router = express.Router();
const db = require("../models");





/* GET MSG with TS*/
router.get("/messages/:ts", (req, res, next) =>{
  const ts = req.params.ts;
  return db.Message.findOne({ where: { ts:ts } })
    .then((msg) => {
      if (msg) {
        return res.send(msg);
      }
      else{
        return res
        .status(400)
        .send({ error: "Mensaje no existe pai :(" });
      }
    })
    .catch((err) => {
      return res.send(err);
    });
});

let broadcast = (recipients, msg) => {
  recipients.forEach((recipient) => recipient.send(JSON.stringify(msg)));
};

/* POST create a new message */
router.post("/messages",  (req, res, next)=> {
  const { error } = validateForm(req.body);

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  const { message, author, ts } = req.body;

  
  broadcast(req.ws.clients, req.body);



  //save the new message
  db.Message.create({ message, author, ts })
    .then((message) => res.status(201).send({ message }))
    .catch((err) => {
      return res.status(400).send({ error: "No se pudo crear el mensaje :(" });
    });
});

router.put("/messages/:ts", (req, res, next)=> {
  const { error } = validateFormUpdate(req.body);

  if (error) {
    return res.status(400).send({ error: "Invalido, no se pudo actualizar el mensaje :(" });
  }

  const ts = req.params.ts;
  return db.Message.findOne({ where: { ts: ts } }).then((sms) => {
    const { message, author } = req.body;
    if (sms) {
      return sms
      .update({ message, author })
      .then(() => res.send({ sms }))
      .catch((err) => {
        res.status(400).send(err);
      });
      
    }
    return res
        .status(400)
        .send({ error: "Mensaje no existe :(" });
  });
});

/* DELETE delete a message given the ts */
router.delete("/messages/:ts",  (req, res, next)=> {
  const ts = req.params.ts;
  return db.Message.findOne({ where: { ts } }).then((sms) => {
    if (!sms) {
      return res
        .status(400)
        .send({ error: "A message with the specified TS does not exist." });
    }
    return sms
      .destroy({ force: true })
      .then(() => res.status(204).send())
      .catch((err) => {
        console.log(
          "There was an error deleting the message.",
          JSON.stringify(err)
        );
        res.status(400).send(err);
      });
  });
});

const  validateForm=(message)=> {
  const schema = Joi.object({
    message: Joi.string().min(5).required(),
    author: Joi.string()
      .regex(RegExp(/^\w+(?:\s\w+)$/))
      .required(),
    ts: Joi.number().required(),
  });

  return schema.validate(message);
}

 const validateFormUpdate= (message)=> {
  const schema = Joi.object({
    message: Joi.string().min(5).required(),
    author: Joi.string()
      .regex(RegExp(/^\w+(?:\s\w+)$/))
      .required(),
  });

  return schema.validate(message);
}
/* GET MSGs*/
router.get("/messages",  (req, res, next) =>{
  return db.Message.findAll()
    .then((msgs) => res.send(msgs))
    .catch((err) => res.send(err)
    );
});
module.exports = router;
