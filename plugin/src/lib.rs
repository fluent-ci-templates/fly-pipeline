use extism_pdk::*;
use fluentci_pdk::dag;

#[plugin_fn]
pub fn setup(version: String) -> FnResult<String> {
    let version = if version.is_empty() {
        "latest".to_string()
    } else {
        version
    };

    let stdout = dag()
        .pkgx()?
        .with_exec(vec!["type node > /dev/null || pkgx install node"])?
        .with_exec(vec!["pkgx", "install", &format!("fly@{}", version)])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn deploy(args: String) -> FnResult<String> {
    let stdout = dag()
        .pkgx()?
        .with_packages(vec!["fly"])?
        .with_exec(vec!["fly", "deploy", "--remote-only", &args])?
        .stdout()?;
    Ok(stdout)
}
