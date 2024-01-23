# Step 1: Choose a base image
FROM node:14

# Step 2: Set up working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of your code
COPY . .

# Step 6: Build your application (if needed)
RUN npm run build

# Step 7: Start your application
CMD ["npm", "run", "serve"]
