// server.js
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config(); // Pour charger les variables d'environnement depuis .env
const cors = require("cors"); // Importez le middleware cors

const app = express();
const port = process.env.PORT || 3000;

// Configuration CORS
const allowedOrigins = [
    "https://ulfrank2024.github.io", // L'origine de votre GitHub Pages
    "http://localhost:5500", // Votre environnement de développement local (si vous l'utilisez)
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

app.use(cors(corsOptions)); // Utilisez le middleware CORS avec les options

// Middleware pour parser le corps des requêtes POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuration de Nodemailer avec les variables d'environnement
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true", // Convertir la chaîne en booléen
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

app.get("/", (req, res) => {
    res.send("Serveur Sticksy est en ligne !");
});

app.post("/envoyer-demande", async (req, res) => {
    try {
        const {
            nom,
            email,
            telephone,
            service,
            quantiteEtiquettes,
            dimensionsEtiquettes,
            materiauEtiquettes,
            designEtiquettes,
            quantiteCartesPlastique,
            finitionCartesPlastique,
            designCartesPlastique,
            rectoVersoCartesPlastique,
            quantiteCartesCarton,
            finitionCartesCarton,
            designCartesCarton,
            rectoVersoCarton,
            optionsSupplementairesCarton,
            budget,
            details,
            methodeLivraison,
        } = req.body;

        const mailOptions = {
            from: process.env.SMTP_FROM_EMAIL,
            to: process.env.SMTP_FROM_EMAIL, // Envoyer à la même adresse pour la démo
            subject: "Nouvelle Demande de Devis depuis le Site Sticksy",
            text: `Nom: ${nom}\nEmail: ${email}\nTéléphone: ${telephone}\nService Souhaité: ${service}\n\n-- Détails --\n${
                quantiteEtiquettes
                    ? `Quantité d’étiquettes: ${quantiteEtiquettes}\n`
                    : ""
            }${
                dimensionsEtiquettes
                    ? `Dimensions étiquettes: ${dimensionsEtiquettes}\n`
                    : ""
            }${
                materiauEtiquettes
                    ? `Matériau étiquettes: ${materiauEtiquettes}\n`
                    : ""
            }${
                designEtiquettes
                    ? `Design étiquettes: ${designEtiquettes}\n`
                    : ""
            }${
                quantiteCartesPlastique
                    ? `Quantité cartes plastique: ${quantiteCartesPlastique}\n`
                    : ""
            }${
                finitionCartesPlastique
                    ? `Finition cartes plastique: ${finitionCartesPlastique}\n`
                    : ""
            }${
                designCartesPlastique
                    ? `Design cartes plastique: ${designCartesPlastique}\n`
                    : ""
            }${
                rectoVersoCartesPlastique
                    ? `Recto-verso cartes plastique: ${rectoVersoCartesPlastique}\n`
                    : ""
            }${
                quantiteCartesCarton
                    ? `Quantité cartes carton: ${quantiteCarton}\n`
                    : ""
            }${
                finitionCartesCarton
                    ? `Finition cartes carton: ${finitionCarton}\n`
                    : ""
            }${
                designCartesCarton
                    ? `Design cartes carton: ${designCarton}\n`
                    : ""
            }${
                rectoVersoCarton
                    ? `Recto-verso cartes carton: ${rectoVersoCarton}\n`
                    : ""
            }${
                optionsSupplementairesCarton
                    ? `Options supplémentaires cartes carton: ${optionsSupplementairesCarton.join(
                          ", "
                      )}\n`
                    : ""
            }${
                methodeLivraison
                    ? `Méthode de livraison: ${methodeLivraison}\n`
                    : ""
            }Budget Proposé: ${budget}\n\nInformations Supplémentaires:\n${details}`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("E-mail envoyé: " + info.response);
        res.send("Votre demande a été envoyée avec succès !");
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'e-mail:", error);
        res.status(500).send("Erreur lors de l'envoi de l'e-mail.");
    }
});

app.listen(port, () => {
    console.log(`Serveur Node.js écoutant sur le port ${port}`);
});
