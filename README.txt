PARA KLIK - kurulum

1) console.firebase.google.com > proje olustur > Build > Authentication > Sign-in method > Anonymous'i ACIK yap.
2) Build > Firestore Database > Create database (test degil, production) > Rules sekmesine sunu yapistir > Publish:

rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /players/{u} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == u;
    }
    match /clans/{c} {
      allow read, create, update: if request.auth != null;
    }
  }
}

3) Project settings > Your apps > Web (</>) ekle > cikan firebaseConfig degerlerini
   app/src/main/assets/index.html dosyasinin basindaki FIREBASE_CONFIG icine yaz.
4) GitHub'a gonder, Actions APK'yi derler.
