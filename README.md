<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BioLinkLite Node API</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1, h2, h3 {
            color: #333;
        }
        pre {
            background: #f4f4f4;
            padding: 10px;
            border: 1px solid #ddd;
            overflow-x: auto;
        }
        code {
            background: #f4f4f4;
            padding: 2px 4px;
            border-radius: 4px;
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>BioLinkLite Node API</h1>
        <p><strong>BioLinkLite</strong> is a Node.js API designed to manage profiles and their associated custom links and social media links. This API provides endpoints to create, read, update, and delete profiles, custom links, and social media links.</p>
        
        <h2>Installation</h2>
        <p>To get started, clone the repository and install the necessary dependencies:</p>
        <pre><code>git clone https://github.com/mr-pacifist/biolinklite_node_APi.git
cd biolinklite_node_APi
npm install</code></pre>

        <h2>Usage</h2>
        <p>Before running the API, make sure to set up the environment variables. Create a <code>.env</code> file in the root directory. Follow the <code>example.env</code> and fill all environment variables correctly.</p>
        <p>Run the API using the following commands:</p>
        <pre><code>npx prisma migrate dev init
npm run seed
npm start</code></pre>
    </div>
</body>
</html>
