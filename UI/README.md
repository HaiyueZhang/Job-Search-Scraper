# UI
This repository is to provide a user interface and connect every microservices together. It uses the React framework to build the web ui. Next, this readme file will show you how to set up and run this project.

## Set up

### Prerequisites

Ensure your development environment includes the following installed software:

- Node.js (latest stable version recommended)
- npm (typically installed with Node.js)
- Git (for cloning the repository)

### Cloning the Repository

First, you need to clone the repository to your local machine. Open your command line or terminal and run the following commands:

```bash
git clone git@github.com:BUGGYSOFT-Cloud/UI.git
cd UI/app/
```

### Installing Dependencies

Once you are in the project directory, you need to install the project dependencies. Run the following command in your terminal:

```bash
npm install
```

This will install all the necessary npm packages listed as dependencies in the `package.json` file.

### Environment Variables

The project requires setting environment variables. Please create a file named `.env` in the project root directory and add the necessary environment variables:

```plaintext
REACT_APP_API_URL=http://theUrl
```
For privacy reasons, the url is not shown here. Please contact us for the url if needed!

### Running the Project

After installing all dependencies and setting the environment variables, you can start the project. Run the following command in the command line to start the development server:

```bash
npm start
```

This command will start a local development server, usually accessible at `http://localhost:3000`. Your default web browser should automatically open this address, displaying your application.

### Building for Production

If you need to build the project for production, you can use the following command:

```bash
npm run build
```

This will create an optimized version of your project in the `build` directory, which you can deploy to any static file server.

## Additional Information

Make sure to check the `package.json` file to understand the available scripts and dependencies. If the project includes other specific build steps or considerations, be sure to add appropriate instructions to the README.
