export const upsertUserProfile = async (profile: any) => {
  console.log('Mock upsertUserProfile', profile);
  return { data: profile, error: null };
};

export const upsertSettings = async (settings: any) => {
  console.log('Mock upsertSettings', settings);
  return { data: settings, error: null };
};
