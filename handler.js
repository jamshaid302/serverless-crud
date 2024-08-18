import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;

export const create = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const params = {
      TableName: TABLE_NAME,
      Item: {
        id: uuidv4(),
        ...data,
      },
    };

    await dynamoDB.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Item created Successfully.",
        item: params.Item,
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error?.message || "Internal Server Error",
      }),
    };
  }
};

export const getAll = async (event) => {
  try {
    const params = {
      TableName: TABLE_NAME,
    };

    const result = await dynamoDB.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error?.message || "Internal Server Error",
      }),
    };
  }
};

export const getSingleItem = async (event) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: event.pathParameters.id,
      },
    };

    const result = await dynamoDB.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Item not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error?.message || "Internal Server Error",
      }),
    };
  }
};

export const updateItem = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: event.pathParameters.id,
      },
      UpdateExpression: "set #attrName = :attrValue",
      ExpressionAttributeNames: {
        "#attrName": "name",
      },
      ExpressionAttributeValues: {
        ":attrValue": data.name,
      },
      ReturnValues: "ALL_NEW",
    };

    const result = await dynamoDB.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Item updated Successfully.",
        updatedItem: result.Attributes,
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error?.message || "Internal Server Error",
      }),
    };
  }
};

export const deleteItem = async (event) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: event.pathParameters.id,
      },
    };

    await dynamoDB.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Item deleted Successfully.",
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error?.message || "Internal Server Error",
      }),
    };
  }
};
