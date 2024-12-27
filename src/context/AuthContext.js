import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import PropTypes from 'prop-types'; // Import de PropTypes

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading(true); // Commence par activer le chargement
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsAdmin(userData.role === 'admin');
          }
          setCurrentUser(user);
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoading(false); // Une fois terminé, désactiver le chargement
    });
  
    return unsubscribe;
  }, []);
  
  const value = { currentUser, isAdmin, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Ajouter la validation des props
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // Validation de 'children' comme étant un ou plusieurs éléments React
};

export default AuthProvider;
