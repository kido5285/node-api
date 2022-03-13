require('dotenv').config();
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } = require("firebase/firestore");
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const firebaseApp = initializeApp({
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
})

app.use(express.json());

const firestore = getFirestore();

app.get('/', (req, res) => {
    getDocs(collection(firestore, "exercises")).then(snapshot => {
        let exercises = [];
        snapshot.forEach((doc) => {
          exercises.push(doc.data());
        });
        return res.json(exercises);
    });
})

app.get('/:id', (req, res) => {
    getDocs(collection(firestore, "exercises")).then(snapshot => {
        let found = false;
        snapshot.forEach(inddoc => {
            if(inddoc.data()['id'] === parseInt(req.params.id)){
                found = true;
                console.log()
                return res.json(inddoc.data());
            }
        })
        if(!found){
            return res.status(404).send('Error id not found');
        }
    })
})

app.post('/edit/:id', (req, res) => {
    getDocs(collection(firestore, "exercises")).then(snapshot => {
        let ref = '';
        snapshot.forEach((inddoc) => {
          if(inddoc.data()['id'] === parseInt(req.params.id)){
              ref = doc(firestore, 'exercises', inddoc.id);
              updateDoc(ref, req.body);
              return res.send('updated');
          }
        });
        if(ref === ''){
            return res.status(404).send('Error id not found');
        }
    })
})

app.post('/delete', (req, res) => {
    getDocs(collection(firestore, "exercises")).then(snapshot => {
        let ref = '';
        snapshot.forEach((inddoc) => {
          if(inddoc.data()['id'] === parseInt(req.body.id)){
              ref = doc(firestore, 'exercises', inddoc.id);
              deleteDoc(ref);
              return res.send('deleted');
          }
        });
        if(ref === ''){
            return res.status(404).send('Error id not found');
        }
    })
})

app.post('/update', (req, res) => {
    getDocs(collection(firestore, "exercises")).then(snapshot => {
        let ref = '';
        snapshot.forEach((inddoc) => {
          if(inddoc.data()['id'] === parseInt(req.body.id)){
              ref = doc(firestore, 'exercises', inddoc.id);
              updateDoc(ref, {
                'completed': !inddoc.data().completed
              });
              return res.send('updated');
          }
        });
        if(ref === ''){
            return res.status(404).send('Error id not found');
        }
    })
})

app.post('/create', (req, res) => {
    addDoc(collection(firestore, "exercises"), req.body);
    return res.send('success');
})

app.listen(port, () => {
    console.log(`Running on port ${port}, http://localhost:${port}`)
})