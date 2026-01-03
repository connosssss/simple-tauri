use tauri::{LogicalPosition, LogicalSize, Manager, Wry, Webview};


#[tauri::command]
async fn create_webview(app: tauri::AppHandle<Wry>, url: String, x: f64, y: f64, width: f64, height: f64) -> Result<(), String> {
    
    let window = app.get_window("main");

    let parsed_url: url::Url = url.parse().map_err(|e: url::ParseError| e.to_string())?;
    
    let new_webview: Webview<Wry> = window.add_child(
        tauri::webview::WebviewBuilder::new("browser-view", tauri::WebviewUrl::External(parsed_url)).auto_resize(),
            LogicalPosition::new(x, y),
            LogicalSize::new(width, height),
        )
        .map_err(|e: tauri::Error| e.to_string())?;

    Ok(())
}



#[tauri::command]
async fn resize_webview(app: tauri::AppHandle<Wry>, x: f64, y: f64, width: f64, height: f64,) -> Result<(), String> {

    if let Some(webview) = app.get_webview("browser-view") {
        webview.set_position(LogicalPosition::new(x, y)).map_err(|e: tauri::Error| e.to_string())?;
        webview.set_size(LogicalSize::new(width, height)).map_err(|e: tauri::Error| e.to_string())?;
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![create_webview, resize_webview])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
