#!/bin/sh -e
cd "$(dirname "$0")/../server"
go build -ldflags='-s -w'
cp -f sdvote /mnt/2Tb/stable-diffusion-docker/sdvote/sdvote