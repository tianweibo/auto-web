FROM alpine:3.5
ADD dist /data
CMD ["tail", "-f", "/dev/null"]
