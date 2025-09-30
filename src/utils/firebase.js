import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  signOut,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  sendEmailVerification,
} from "firebase/auth";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  getDocs,
  updateDoc,
  deleteDoc,
  increment,
  where,
  orderBy, // ← needed for fetchTutorialsAndDocuments
} from "firebase/firestore";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  uploadBytes,
} from "firebase/storage";
import { getDownloadURL } from "firebase/storage";

// Firebase config from Vite env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Init Firebase app
const app = initializeApp(firebaseConfig);

// Init Auth (persist in local storage)
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

// Google provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

// Sign in with Google (popup)
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

// Sign out current user
export const logout = () => signOut(auth);

// Init Firestore & Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

// Upload a thumbnail file and return its public URL
export const uploadThumbnail = async (file, uid) => {
  if (!file) return null;
  const fileRef = ref(
    storage,
    `users/${uid}/thumbnails/${Date.now()}_${file.name}`
  );
  const snap = await uploadBytes(fileRef, file);
  return getDownloadURL(snap.ref);
};

// Upload a (large) video with resumable upload and return its URL
export const uploadVideo = async (file, uid) => {
  if (!file) return;
  const fileRef = ref(
    storage,
    `users/${uid}/videos/${Date.now()}_${file.name}`
  );
  const task = uploadBytesResumable(fileRef, file);
  await new Promise((resolve, reject) => {
    task.on("state_changed", undefined, reject, resolve);
  });
  return getDownloadURL(task.snapshot.ref);
};

// Create a new "tutorials" doc from provided data
export const createTutorialDocFromData = async (tutorialData) => {
  if (!tutorialData) return;
  const tutorialDocRef = doc(collection(db, "tutorials"));
  const { title, videoUrl, thumbnailUrl, uploaderUid, uploaderName } =
    tutorialData;
  const createdAt = new Date();
  try {
    await setDoc(tutorialDocRef, {
      title,
      videoUrl,
      thumbnailUrl,
      uploaderUid,
      uploaderName,
      views: 0,
      ratingsCount: 0,
      ratingsSum: 0,
      createdAt,
    });
  } catch (error) {
    console.log("error in creating ", error.message);
  }
  return tutorialDocRef;
};

// Return a Query for all tutorials in descending order
export const fetchTutorialsAndDocuments = () => {
  const collectionRef = collection(db, "tutorials");
  const q = query(collectionRef, orderBy("createdAt", "desc"));
  return q;
};

// Return a Query for the user tutorials in descending order
export const fetchUserTutorials = (uid) => {
  const collectionRef = collection(db, "tutorials");
  const q = query(
    collectionRef,
    where("uploaderUid", "==", uid),
    orderBy("createdAt", "desc")
  );
  return q;
};

// Delete a tutorial document by id
export const deleteTutorialDocById = async (tutorialId) => {
  if (!tutorialId) return;
  const tutorialDocRef = doc(db, "tutorials", tutorialId);
  try {
    await deleteDoc(tutorialDocRef);
  } catch (error) {
    console.log("error in deleting ", error.message);
  }
  return tutorialDocRef;
};

// Atomically increment a tutorial's views
export const incrementTutorialViews = async (tutorialId) => {
  if (!tutorialId) return;
  const tutorialDocRef = doc(db, "tutorials", tutorialId);
  try {
    await updateDoc(tutorialDocRef, { views: increment(1) });
  } catch (error) {
    console.log("error in incrementing view ", error.message);
  }
  return tutorialDocRef;
};

// Check if a user has already rated this tutorial
export const hasUserReviewed = async (tutorialId, uid) => {
  if (!tutorialId || !uid) return false;
  const ratingRef = doc(db, "tutorials", tutorialId, "ratings", uid);
  const snap = await getDoc(ratingRef);
  return snap.exists();
};

// Add a one-time rating for a tutorial and update the ratings
export const addTutorialRating = async (tutorialId, uid, stars) => {
  if (!tutorialId || !uid || !stars) return null;
  const ratingRef = doc(db, "tutorials", tutorialId, "ratings", uid);
  const tutorialRef = doc(db, "tutorials", tutorialId);

  // Prevent multiple ratings by same user
  const existing = await getDoc(ratingRef);
  if (existing.exists()) return null;

  // Create user rating doc
  await setDoc(ratingRef, { uid, stars, createdAt: new Date() });

  // Update counters
  await updateDoc(tutorialRef, {
    ratingsCount: increment(1),
    ratingsSum: increment(stars),
  });

  return { ok: true };
};

// Create user profile doc on first sign-in
export const createUserDocFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;
  const userDocRef = doc(db, "users", userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error in creating ", error.message);
    }
  }
  return userDocRef;
};

// Register user with email/password
export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

// Sign in user with email/password
export const signinAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

// Send a password reset email (redirect to SITE_URL/login after reset)
const SITE_URL = import.meta.env.VITE_SITE_URL;
export const resetPassword = async (email) => {
  if (!email) return;
  await sendPasswordResetEmail(auth, email, { url: `${SITE_URL}/login` });
};

// Send a verification email (continue at /otp after verification)
export const sendVerificationEmail = async (user) => {
  if (!user) return;
  await sendEmailVerification(user, { url: `${SITE_URL}/otp` });
};

// Check if a user doc exists by email
export async function userExistsByEmail(email) {
  const q = query(
    collection(db, "users"),
    where("email", "==", email.toLowerCase())
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

// Verify a password reset code (oobCode)
export const verifyResetCode = (oobCode) => {
  return verifyPasswordResetCode(auth, oobCode);
};

// Confirm the new password using the reset code
export const confirmResetPassword = (oobCode, newPassword) => {
  return confirmPasswordReset(auth, oobCode, newPassword);
};

// Create Question
export const createQuestionDocFromData = async (questionData) => {
  if (!questionData) return;
  const docRef = doc(collection(db, "questions"));
  const { title, description, tags, authorUid } = questionData;
  const createdAt = new Date();

  try {
    await setDoc(docRef, { title, description, tags, authorUid, createdAt });
  } catch (error) {
    console.log("error in creating ", error);
  }
  return docRef;
};

export const fetchQuestions = () => {
  const collectionRef = collection(db, "questions");
  const q = query(collectionRef, orderBy("createdAt", "desc"));
  return q;
};

export const createArticleDocFromData = async (articleData) => {
  if (!articleData) return;
  const docRef = doc(collection(db, "articles"));
  const { title, abstract, text, tags, imageUrl } = articleData;
  const createdAt = new Date();

  try {
    await setDoc(docRef, { title, abstract, text, tags, imageUrl, createdAt });
  } catch (error) {
    console.log("error in creating ", error);
  }
  return docRef;
};

export const uploadImage = async (file) => {
  if (!file) return "";
  const fileRef = ref(storage, `articles/${Date.now()}_${file.name}`);
  const snap = await uploadBytes(fileRef, file);
  return getDownloadURL(snap.ref);
};

export const deleteQuestionDocById = async (questionId) => {
  if (!questionId) return;
  const questionDocRef = doc(db, "questions", questionId);
  try {
    await deleteDoc(questionDocRef);
  } catch (error) {
    console.log("error in deleting ", error);
  }
  return questionDocRef;
};
