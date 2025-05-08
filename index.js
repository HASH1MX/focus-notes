import supabase from "./supabaseClient.js";

const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Sign-up error:", error.message);
  } else {
    console.log("User signed up:", data);
  }
};

// Test it with an example email
signUp("hashim8work@gmail.com", "Hashim112233");
