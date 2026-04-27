FROM rust:1.95.0-slim as builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/target/release/vchan-worker .
ENV HOST=0.0.0.0
CMD ["./vchan-worker"]