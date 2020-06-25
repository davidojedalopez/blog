---
title: 25 Days of serverless - Day 1
published: true
description: Solution for the first challenge of 25 Days of Serverless
tags: '25 Days Of Serverless, serverless, aws'
series: 25 Days of Serverless
cover_image: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--k0KWRU4j--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/4ld34pt62433i7mwh1zb.jpeg
type_of: article
id: 214252
published_at: 2019-12-02
slug: 25-days-of-serverless-day-01-3g4b
path: /david_ojeda/25-days-of-serverless-day-01-3g4b
url: 'https://dev.to/david_ojeda/25-days-of-serverless-day-01-3g4b'
comments_count: 0
public_reactions_count: 13
page_views_count: 249
published_timestamp: '2019-12-02T23:26:38Z'
positive_reactions_count: 13
tag_list:
  - 25daysofserverless
  - serverless
  - aws
canonical_url: 'https://dev.to/david_ojeda/25-days-of-serverless-day-01-3g4b'
---

<details open>
  <summary>
    Index
  </summary>

  [[toc]]

</details>

*Cover image taken from [Microsoft's 25 Days of Serverless repo](https://github.com/microsoft/25-days-of-serverless/blob/master/week-1/challenge-1/README.md)*

***



Yesterday while scrolling through Twitter I found an interesting opportunity to learn about the current state of serverless technologies, it's called **[25 Days of Serverless](https://25daysofserverless.com/)**. 

It's an initiative from Microsoft that consists of one challenge each day from the 1st through the 25th of December. 

I decided to give it a try, but using AWS as the cloud provider since it's what I use every day. **The point of the challenge is to learn, not to show what provider is the best.**

So fasten your seatbelts since I'll be posting my solutions for the next 25 days 🤘🏼

## Challenge 1: A Basic Function

Here is the description from their GitHub repo:

> 🎶 "I had a little dreidel
> I made it out of sand
> And when I tried to spin it
> It crumbled in my hand!" 🎶

> Your first stop is Tel Aviv, Israel, where everybody is concerned about Hanukkah! Not only have all the dreidels been stolnen, but so have all of the servers that could replicate spinning a top!

> Have no fear, though: you have the capability to spin not only dreidels, but to spin up serverless applications that can spin a dreidel just as well as you can!

> Your task for today: create a REST API endpoint that spins a dreidel and randomly returns נ (Nun), ג (Gimmel), ה (Hay), or ש (Shin). This sounds like a great opportunity to use a serverless function to create an endpoint that any application can call!

## My solution

I used the AWS [Serverless Application Model (SAM)](https://aws.amazon.com/serverless/sam/) CLI since it provides a pre-defined template with built-in best practices for serverless applications and functions. Internally it uses the following services:
- AWS Lambda
- AWS API Gateway
- AWS CloudFormation

### Creating the app

Since it is my **first time developing a serverless application** I went with the [Hello World tutorial](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html). It guides you through the **minimum steps needed to have a serverless endpoint up and running**; most of the tutorial is pure magic from the AWS SAM CLI 🧙🏻‍♂️.

So, following this tutorial, I went with a quick start template and the nodejs12.x runtime:

```bash
$ sam init
Which template source would you like to use?
	1 - AWS Quick Start Templates
	2 - Custom Template Location
Choice: 1 

Which runtime would you like to use?
	1 - nodejs12.x
	2 - python3.8
	3 - ruby2.5
	4 - go1.x
	5 - java11
	6 - dotnetcore2.1
	7 - nodejs10.x
	8 - nodejs8.10
	9 - nodejs6.10
	10 - python3.7
	11 - python3.6
	12 - python2.7
	13 - java8
	14 - dotnetcore2.0
	15 - dotnetcore1.0
Runtime: 1
```

This command by itself will create a project structure and the files needed for a serverless app with a single endpoint and Lambda function.

It looks like this:

```bash
$ tree
.
├── README.md
├── events
│   └── event.json                # Sample event for testing
├── hello-world
│   ├── app.js                    # AWS Lambda logic
│   ├── package.json              # Dependencies
│   └── tests
│       └── unit
│           └── test-handler.js
└── template.yaml                 # SAM template for AWS resources

4 directories, 6 files
```

### Building the app

The AWS SAM CLI facilitates this step too:

```bash
sam build
```

This creates the actual artifacts that will be deployed to AWS, which in this case are the AWS Lambda function code and the CloudFormation template. 

If you have Docker installed you can **test your API endpoint locally before deploying to AWS**. Supposing you have so, you can run:

```bash
sam local start-api
```

and navigate to the given endpoint on your localhost to see the 'Hello World' response!

At this point, you are ready to deploy your Hello World serverless app, but that's not what we have been asked to do 🤔

From the initial challenge spec: 

> Your task for today: create a REST API endpoint that spins a dreidel and randomly returns נ (Nun), ג (Gimmel), ה (Hay), or ש (Shin). This sounds like a great opportunity to use a serverless function to create an endpoint that any application can call!

We have to modify our `app.js` file to solve this problem. My solution goes like this:

```javascript
exports.lambdaHandler = async (event, context) => {
    try {
        let possibleResults = ["נ", "ג", "ה", "ש"]
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                result: possibleResults[Math.floor(Math.random() * Math.floor(possibleResults.length))],                
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
```

I created an array with the four possible results and made the endpoint randomly return one of them in JSON format.

### Deploying the app

According to the tutorial you can now go ahead and deploy the app with this command:

```bash
sam deploy --guided
```

but I got an error saying that the IAM role for the Lambda function was not found. As far as I know, I gave permission to the AWS SAM CLI to create the necessary roles to run the app. I also tried creating the IAM role first before deploying the function; however, I got the same error. 

I ended up deleting this piece of code from the `Outputs` section of the `template.yaml` file:

```yaml
  HelloWorldFunctionIamRole:
    Description: "Implicit IAM Role created for Hello World function"
    Value: !GetAtt HelloWorldFunctionRole.Arn
```

and this allowed the deployment process to create an IAM role for the function. 

With that out of the way, the deploy command should work correctly and return you an HTTPS endpoint from API Gateway to call your API 🥳

Here is [my GitHub repo with the final version of all the files](https://github.com/davidojedalopez/25-days-of-serverless-day-01). You can notice that I changed how the endpoint and resources are named, but nothing else.

---

## Recap

This concludes the first day challenge of 25 Days of Serverless.

At first, I was overwhelmed by the amount of boilerplate created just to run a single AWS Lambda function, but later I realized that all that code includes very useful things like the HTTPS API endpoint access and the advantage of having every resource codified; similar to *Infrastructure-as-Code*.

I also noticed that some files for testing were created. I haven't yet tried to create tests for a serverless app. That should come soon though!

---

Thanks a lot for reading me! I learned a lot just by doing this first challenge, can't wait for the rest! 💙
