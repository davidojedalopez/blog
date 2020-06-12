---
type_of: article
id: 125734
title: whats-your-take-on-writing-tests-for-third-party-services-or-integrations
description: >-
  Let's say you have an application that uses Stripe.  Stripe gives you a dev
  environment- own API key,...
published: true
published_at: '2019-06-19'
slug: >-
  what-s-your-take-on-writing-tests-for-third-party-services-or-integrations-1bco
path: >-
  /david_ojeda/what-s-your-take-on-writing-tests-for-third-party-services-or-integrations-1bco
url: >-
  https://dev.to/david_ojeda/what-s-your-take-on-writing-tests-for-third-party-services-or-integrations-1bco
comments_count: 7
public_reactions_count: 8
page_views_count: 422
published_timestamp: '2019-06-19T01:08:33Z'
positive_reactions_count: 8
cover_image: null
tag_list:
  - discuss
  - testing
canonical_url: >-
  https://dev.to/david_ojeda/what-s-your-take-on-writing-tests-for-third-party-services-or-integrations-1bco
---
Let's say you have an application that uses Stripe.

Stripe gives you a dev environment- own API key, own dashboard, own data, all separated from your Stripe's live data. 

**Do you write tests that interact with this dev environment or do you mock the responses or something alike?**


I work on an app that has many integration tests communicating with test/dev/sandbox environments, and they sometimes fail due to errors on their services, not on our own. Now we're discussing if should we mock the responses instead.
