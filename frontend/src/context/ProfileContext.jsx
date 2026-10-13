import React, { createContext, useContext, useState, useEffect } from 'react';
import { profileApi, savedApi } from '../services/api';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(new Set());

  const refreshProfile = async () => {
    try {
      setLoading(true);
      const data = await profileApi.getProfile();
      setProfile(data);
      if (data && data.savedOpportunityIds) {
        setSavedIds(new Set(data.savedOpportunityIds));
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const toggleSaved = async (opportunityId) => {
    const idNum = Number(opportunityId);
    const isSaved = savedIds.has(idNum);
    try {
      if (isSaved) {
        await savedApi.remove(idNum);
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(idNum);
          return next;
        });
      } else {
        await savedApi.save(idNum);
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.add(idNum);
          return next;
        });
      }
      // Silently refresh profile
      const updated = await profileApi.getProfile();
      setProfile(updated);
    } catch (err) {
      console.error('Failed to toggle save status', err);
    }
  };

  const toggleDocument = async (docKey) => {
    try {
      const updated = await profileApi.toggleDocument(docKey);
      setProfile(updated);
      return updated;
    } catch (err) {
      console.error('Failed to toggle document completion', err);
      throw err;
    }
  };

  const updateProfile = async (newProfile) => {
    try {
      const updated = await profileApi.updateProfile(newProfile);
      setProfile(updated);
      if (updated && updated.savedOpportunityIds) {
        setSavedIds(new Set(updated.savedOpportunityIds));
      }
      return updated;
    } catch (err) {
      console.error('Failed to update profile', err);
      throw err;
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        savedIds,
        refreshProfile,
        toggleSaved,
        toggleDocument,
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
