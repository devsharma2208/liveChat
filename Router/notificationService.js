let express = require("express");
let amqp = require('amqplib')
const {
  jwtVerification,
} = require("../authenticatVerification/authenticatVerify");
const { notificationModel } = require("../Model/notification/notification");

let notificationService = express.Router();

notificationService.post(
  "/notifications",
  jwtVerification,
  async (req, res) => {
    const { message } = req.body;
    try {
      const notification = new notificationModel({
        userId: req.userId,
        message,
        read: false,
      });
      await notification.save();
      
      const conn = await amqp.connect('amqp://localhost');
      const ch = await conn.createChannel();
      await ch.assertQueue('notifications');
      ch.sendToQueue('notifications', Buffer.from(JSON.stringify(notification)));

      res.status(201).json({
        status: true,
        message: "Successfull Notification created",
        notification,
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: false, message: "Server error", result: err });
    }
  }
);

notificationService.get("/notifications", jwtVerification, async (req, res) => {
  try {
    const notifications = await notificationModel.find({ userId: req.userId });
    res.status(200).json({ status: true, notifications });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Server error", result: err });
  }
});

notificationService.get(
  "/notifications/:id",
  jwtVerification,
  async (req, res) => {
    try {
      const notifications = await notificationModel.findById(req.params.id);
      res.status(200).json({ status: true, notifications });
    } catch (err) {
      res
        .status(500)
        .json({ status: false, message: "Server error", result: err });
    }
  }
);

notificationService.put(
  "/notifications/:id",
  jwtVerification,
  async (req, res) => {
    try {
      const notifications = await notificationModel.findByIdAndUpdate(
        req.params.id,
        { read: true }
      );
      if (!notifications) {
        return res
          .status(404)
          .json({ status: false, message: "Notification not found" });
      }

      res.status(200).json({
        status: true,
        message: "Notification marked as read",
        notifications,
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: false, message: "Server error", result: err });
    }
  }
);

module.exports = { notificationService };
