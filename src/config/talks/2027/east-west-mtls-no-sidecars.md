---
id: east-west-mtls-no-sidecars
title: 'East-West mTLS, no sidecars: Ztunnel on Cilium 1.19'
type: talk
speakerIds:
  - stephane-karagulmez
tags:
  - ENG
level: Intermediate
image: /images/talks/2026/east-west-mtls-no-sidecars.webp
video: ''
slide: ''
---

Cilium 1.19 adds native integration with ztunnel, a per-node proxy that transparently encrypts and authenticates TCP traffic between enrolled workloads. No application changes and no sidecar injection. Opt in per namespace; cilium-agent handles enrollment, certificates, and discovery