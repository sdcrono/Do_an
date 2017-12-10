//
import gcm = require("node-gcm");

let sender = new gcm.Sender("1041806212844");

let message = new gcm.Message({
    notification: {
        title: "Hello Wolrd!",
        icon: "your_icon_name",
        body: "Here is a notification's body"
    },
});

let recipients: gcm.IRecipient = { to: "/topics/all" };

sender.sendNoRetry(message, recipients, (err, res) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log(res);
    }
})