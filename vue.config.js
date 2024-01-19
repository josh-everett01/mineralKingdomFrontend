module.exports = {
  devServer: {
    port: process.env.PORT || 8080,  // Use the PORT environment variable, default to 8080 if not set
    public: 'mineralkingdomfrontend.onrender.com',  // Set the public host
    disableHostCheck: true,  // Optionally, you can disable host check (use with caution)
    headers: {
      'Access-Control-Allow-Origin': '*'  // If you're dealing with CORS issues
    }
  }
};
