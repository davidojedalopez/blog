---
title: aws-iam-pt-1---the-basics
published: true
description: Basic concepts of AWS Identity Access Management (IAM)
tags:
  - aws
  - iam
canonical_url: 'https://dev.to/david_ojeda/aws-iam-pt-1---the-basics-139h'
type_of: article
id: 41317
published_at: '2018-07-30'
slug: aws-iam-pt-1---the-basics-139h
path: /david_ojeda/aws-iam-pt-1---the-basics-139h
url: 'https://dev.to/david_ojeda/aws-iam-pt-1---the-basics-139h'
comments_count: 0
public_reactions_count: 40
page_views_count: 1289
published_timestamp: '2018-07-30T20:54:01Z'
positive_reactions_count: 40
cover_image: null
tag_list:
  - aws
  - iam
---

*Part one of this series covers IAM basics and a general use case.*

*Part two is the implementation of the use case in part one, that is, the creation of users, groups and policies to restrict access to some AWS services:*

[AWS IAM PT2](https://dev.to/david_ojeda/aws-iam-pt-2---a-practical-example-13b6)

***

# What's AWS IAM?
AWS **I**dentity and **A**ccess **M**anagement, called **IAM**, is a feature of AWS that allows you to have fine-grained control over who can access any of your AWS resources and to what extent. Also, it's **free**.

# What can it do?
It can **allow and restrict access** to specific services and actions to specific users or roles- more on this below.

# Why use it?
You don't want every user to be able to do absolutely everything on your account. Usually you want a set of users- or group of users- to execute a set of specific actions on selected services. **That's why you need IAM**.

# Some basic IAM concepts
Once you start using IAM you're going to stumble upon some of these concepts and you need to understand them very well to know when to use one or the other.

- ## Policies
  **Policies are the cornerstone of IAM**. They are the set of rules and restrictions that define the level of access to services and actions to your AWS resources.

- ## Users
  You can think of IAM users as **physical individuals** that need some level of access to your AWS resources either through the console and/or programmatically- e.g., John needs to check if the servers are healthy. **He needs EC2 access**. *(All AWS acronyms used on this post are listed at the end)*

- ## Groups
  Groups are no more than a collection of users that share the same restrictions. Using groups helps you re-use your policies- e.g., your networking team need to do a security audit on your network settings. **They all need VPC access**.

- ## Roles
  Roles are somehow similar to users, except for the fact that roles are used to restrict access from resource to resource- e.g., your server needs to notify a queue of an event. **Your EC2 servers need SQS access**.

We're not yet gonna dive on how to create any of these entities. First, let me show you a common situation where IAM can greatly help you.

Let's suppose you're the CTO of a company with:
- Four developers- Sally, Maria, John and Jane
- One salesperson- Peter
- One accountant- Mary

The developers have different roles on your company: Sally is a DevOps engineer, John and Maria are web developers, and Jane is a mobile developer.

You all use AWS, but each needs a different set of services. You don't want every employee to have access to every resource, so you decide to use IAM to solve this problem.

# But how?
With IAM, you create a **group** for each job role and attach a **policy** for the specific access needed. Then you add users to the adequate group.

Let's define what do each of these groups need:

- **DevOps developers**: Console and programmatic access to ElasticBeanstalk, EC2, S3 and SQS
- **Web developers**: Console and programmatic access to ElasticBeanstalk and S3
- **Mobile developers**: Programmatic access to S3 and AWS mobile services such as Cognito
- **Accountants**: S3 read-only console access to an AWS billing bucket

With these specifications in mind, we can proceed now to create each group and user and assign, or not, console and programmatic access to AWS as well as the needed policies.

What about the salesperson? The salesperson doesn't need AWS access at the moment, so no user for him 🙃

# Wrap up

This was a very broad overview on how IAM can help you manage and control access to your AWS resources. I know this post is very general and doesn't dive deep into how you *actually* achieve this. That's why we're now going to implement this solution on the next blog post!

[AWS IAM PT2](https://dev.to/david_ojeda/aws-iam-pt-2---a-practical-example-13b6)


**Thanks for reading me!** ❤️

***

<small>IAM: Identity Access Management - Permissions within AWS</small>
<small>S3: Simple Storage Service - AWS storage solution</small>
<small>EC2: Elastic Compute Cloud - AWS computational cloud solution</small>
<small>ElasticBeanstalk: AWS-managed computational cloud solution</small>
<small>SQS: Simple Queue Service - AWS queue solution</small>
<small>VPC: Virtual Private Cloud - AWS network management solution</small>
<small>Cognito: AWS solution for mobile sign-in and sign-up</small>

