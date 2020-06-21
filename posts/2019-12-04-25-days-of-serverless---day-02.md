---
title: 25 Days of serverless - Day 2
published: true
description: Solution for the second challenge of 25 Days of Serverless
tags: '25 Days Of Serverless, serverless, aws'
series: 25 Days of Serverless
cover_image: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--2JUu6Mqq--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/mmifllva7vcih9hqkref.jpeg
type_of: article
id: 214991
published_at: 2019-12-04
slug: 25-days-of-serverless-day-02-i2k
path: /david_ojeda/25-days-of-serverless-day-02-i2k
url: 'https://dev.to/david_ojeda/25-days-of-serverless-day-02-i2k'
comments_count: 0
public_reactions_count: 7
page_views_count: 102
published_timestamp: '2019-12-04T05:38:23Z'
positive_reactions_count: 7
tag_list:
  - 25daysofserverless
  - serverless
  - aws
canonical_url: 'https://dev.to/david_ojeda/25-days-of-serverless-day-02-i2k'
---

<details open>
  <summary>
    Index
  </summary>

  [[toc]]

</details>

*Cover image taken from [Microsoft's 25 Days of Serverless repo](https://github.com/microsoft/25-days-of-serverless/blob/master/week-1/challenge-2/README.md)*

***

It's time for the second post of this series, hence the solution to the second challenge of the 25 Days of Serverless! Let's get to it 💪🏼.

## Challenge 2: Task Scheduler ☕️

Here is the [description from their GitHub repo](https://github.com/microsoft/25-days-of-serverless/blob/master/week-1/challenge-2/README.md):

> Lucy's Dilema

> Today we find ourselves in Stockholm, where a little girl named Lucy needs our help!

> Every December 13th, Lucy is tasked with wearing a crown with six lit candles and delivering coffee to all of her family members — her mother, father, sister, and brother. Each candle only lasts ten minutes before burning out, and she needs to be careful to keep the candles lit during the delivery time!

> Lucy is somewhat forgetful, though, and the stolen servers mean Lucy's usual reminder app isn't working! With only a few weeks to go before her big night, Lucy is worried how she'll remember everything she needs to do and keep her timing in order. She thought about using sticky notes with color codes to remind her of the things she needs to do, but what if they get mixed up? How can she optimize her tasks using serverless technology?

> It takes Lucy 25 minutes to make a large pot of coffee that will serve everyone, and about four minutes to deliver two cups of coffee (remember that she only has two hands to deliver them!). As mentioned, the candles will need to be relit every ten minutes.

> Create a task scheduler that will tell Lucy exactly when she should relight candles, pour coffee into cups, and deliver batches of coffee. How you want to notify Lucy is up to you: maybe you can send her an SMS via Twilio, or build a webapp that uses WebSockets and browser notifications?



Then there is a section with tips on when to notify what:

> 8:00 AM - start the coffee, set out 4 cups

> 8:25 AM - pour two cups

> 8:30 AM - light the candles

> 8:35 AM - deliver the coffee to Mom and Dad

> 8:39 AM - return to kitchen, fill two more cups

> 8:40 AM - relight the candles

> 8:45 AM - deliver the coffee to Sister and Brother

> 8:49 AM - return to kitchen, take a break!

*** 

## My solution

Following the same path as the previous challenge, **we're using the AWS SAM CLI to create a serverless app**. This time the following services are used:
- Lambda
- CloudWatch Events
- Simple Notification Service (SNS)
- Identity Access Management (IAM) Roles
- CloudFormation

### Creating the app

We created an app with a quick start template again, only to have the file structure ready to go ✅.

### Resources

All resources are defined on the `template.yaml` file. Let's first go through the Lambda serverless function definition:

```yaml
25DaysOfServerlessDay02:
  Type: AWS::Serverless::Function
  Properties:
    CodeUri: day-02/
    Handler: app.lambdaHandler
    Runtime: nodejs12.x
    Role: !GetAtt 25DaysOfserverlessDay02Role.Arn
    Events:
      day02:
        Type: Schedule
        Properties:
          Schedule: cron(0,25,30,35,39,40,45,49 7 13 12 ? *)
          Name: day-02-schedule
          Description: Schedule to remember when to serve coffee
          Enabled: True
```

The values that are different from the previous challenge are the `Role` and `Events`.

The `Role` value uses a CloudFormation function to get the ARN of an IAM role that we're going to create in this same `template.yaml` file; we'll get to that in a little bit.

**This role is the one that the Lambda function will be allowed to assume and it's needed for SNS.**

The `Event` is where we define the CloudWatch event. Remember, from the tips above, that we want to notify Lucy in specific minutes of the hour. CloudWatch allows us to define a schedule using a cron expression so we can run this Lambda function on those required minutes. Here is the expression:

```bash
0,25,30,35,39,40,45,49 7 13 12 ? *
```

You can check the [AWS specifics of the cron format here](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#CronExpressions). To be sure on what dates this cron expression will run, you can go to the AWS Console, on the CloudWatch Events > Rules section:

![AWS Console. CloudWatch Events Rules to show when cron expression will run](https://thepracticaldev.s3.amazonaws.com/i/2pfpz11mo7bcjlac1mh0.png)

By the way, our cron expression runs on the 7th hour since **AWS works with UTC times**, and Stockholm's timezone is UTC + 1:

![Stockholm's timezone](https://thepracticaldev.s3.amazonaws.com/i/bb9t7tla6yxmxdkknsgs.png)

That will do for the Lambda function. The other resource is the IAM role used to run the function. Here is its definition:

```yaml
  25DaysOfserverlessDay02Role:
    Type: AWS::IAM::Role
    Properties: 
      AssumeRolePolicyDocument: '{
          "Version": "2012-10-17",
          "Statement": [
            {
              "Effect": "Allow",
              "Principal": {
                "Service": "lambda.amazonaws.com"
              },
              "Action": "sts:AssumeRole"
            }
          ]
        }'
      Description: Allow to send SMS through SNS
      ManagedPolicyArns: 
        - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole                      
      Policies:
        - PolicyName: sns_allow_send_sms
          PolicyDocument:
            Version: 2012-10-17
            Statement:
              - Effect: Allow
                Action: 'sns:Publish'
                Resource: '*'
      RoleName: 25DaysOfserverlessDay02Role

```

There are three important keys here: `AssumeRolePolicyDocument`, `ManagedPolicyArns`, and `Policies`.

The first, `AssumeRolePolicyDocument` specifies the trust policy associated with this role, in other words, it defines which entities can assume the role. In this case, the Lambda service. 

Next, the `ManagedPolicyArns` is a list of policies already managed by AWS that you can attach to this new role. The specified policy gives basic execution permissions to our function. You can look for these policies on the AWS Console, under the IAM service:

![AWS IAM managed policies](https://thepracticaldev.s3.amazonaws.com/i/pd7yeh3jj5z5f6obj8w7.png)

Finally, the `Policies` section is a custom policy defined by us that allows our role to publish text messages using SNS.

### The Lambda function code

Now the actual code solution for the challenge 👀 We start by getting the minute when the function was called. We can safely assume that it's running on one of the specified minutes since that's what we defined in the cron schedule:

```javascript
let minutes = new Date(event.time).getMinutes();

let keyMinutes = {
  0: 'Start the coffee, set out 4 cups',
  25: 'Pour two cups',
  30: 'Light the candles',
  35: 'Deliver the coffee to Mom and Dad',
  39: 'Return to kitchen, fill two more cups',
  40: 'Relight the candles',
  45: 'Deliver the coffee to Sister and Brother',
  49: 'Return to kitchen, take a break',
};              
let smsPayload = keyMinutes[ minutes ] || '';
```

Here is a JSON example of the event object used at the beginning:

```json
{
  "id": "cdc73f9d-aea9-11e3-9d5a-835b769c0d9c",
  "detail-type": "Scheduled Event",
  "source": "aws.events",
  "account": "123456789012",
  "time": "1970-01-01T00:39:00Z",
  "region": "us-east-1",
  "resources": [
    "arn:aws:events:us-east-1:123456789012:rule/ExampleRule"
  ],
  "detail": {}
}
```

To get the minute we first transform the `time` String from the `event` object into a date, and then we use `getMinutes()` since that's the time granularity we need. 

We then create an object whose keys are the minutes when the function will run, and whose values are the reminders to Lucy. Now, into actually sending them.

We're using SNS since it's readily available on our Lambda function through the AWS SDK. We create the client at the beginning of the Lamda file:

```javascript
const aws = require('aws-sdk');
```

and we use it like this:

```javascript
var params = {
  Message: smsPayload,
  PhoneNumber: '+523331412794',
};                    

var publishText = await new aws.SNS({apiVersion: '2010-03-31'}).publish(params).promise();   
```

Sending an SMS with SNS only requires the String payload and the phone number 📲.

With that, we have a scheduled Lambda function that reminds Lucy what to do next with minute precision ⏳.

You can find all the [final files on my GitHub repo](https://github.com/davidojedalopez/25-days-of-serverless-day-01/tree/day-02).

You can now go and build and deploy this serverless app with the AWS SAM CLI like in the previous challenge 🥳

## Recap

This concludes with the Day 02 challenge from 25 Days of Serverless. 

Now that it's my second time using the AWS SAM CLI, I could move faster and get straight to what was needed to solve the problem. 

I loved how you can [create events with the CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-local-generate-event.html) and [use them to locally test your Lamda functions] (https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-local-invoke.html). Definitely helps a lot since you don't have to deploy everything to test your changes.

***

Thanks a lot for reading me! 💚
