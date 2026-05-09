fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("cargo:rerun-if-changed=../contract/message.proto");

    prost_build::compile_protos(
        &["../contract/message.proto"],
        &["../contract/"],
    )?;
    Ok(())
}
