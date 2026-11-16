package com.example.shutdownprank

import android.annotation.SuppressLint
import android.app.Activity
import android.graphics.Bitmap
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.DownloadListener
import android.app.DownloadManager
import android.net.Uri
import android.os.Environment
import android.webkit.URLUtil
import android.widget.Toast

class MainActivity : Activity() {
    private lateinit var web: WebView
    private val liveUrl = "https://memirgurbuz44-source.github.io/paraklik/"
    private val offlineUrl = "file:///android_asset/index.html"
    private var fellBack = false

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        web = WebView(this)
        setContentView(web)
        web.settings.javaScriptEnabled = true
        web.settings.domStorageEnabled = true
        web.settings.mediaPlaybackRequiresUserGesture = false
        web.settings.userAgentString = web.settings.userAgentString + " ButtonWarsAndroid/1.0.13"
        web.setDownloadListener(DownloadListener { url, userAgent, contentDisposition, mimeType, _ ->
            try {
                val fileName = URLUtil.guessFileName(url, contentDisposition, mimeType)
                val request = DownloadManager.Request(Uri.parse(url))
                    .setTitle(fileName)
                    .setDescription("Button Wars güncellemesi indiriliyor")
                    .setMimeType(mimeType ?: "application/vnd.android.package-archive")
                    .addRequestHeader("User-Agent", userAgent)
                    .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                    .setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName)
                val manager = getSystemService(DOWNLOAD_SERVICE) as DownloadManager
                manager.enqueue(request)
                Toast.makeText(this, "Güncelleme indiriliyor. Bitince bildirime dokun.", Toast.LENGTH_LONG).show()
            } catch (e: Exception) {
                Toast.makeText(this, "İndirme başlatılamadı: ${e.message}", Toast.LENGTH_LONG).show()
            }
        })
        web.webChromeClient = WebChromeClient()
        web.webViewClient = object : WebViewClient() {
            override fun onReceivedError(
                view: WebView, request: WebResourceRequest, error: WebResourceError
            ) {
                // Ana sayfa yüklenemezse (internet yok) yedek kopyayı aç
                if (request.isForMainFrame && !fellBack) {
                    fellBack = true
                    view.loadUrl(offlineUrl)
                }
            }
        }
        web.loadUrl(liveUrl)
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (web.canGoBack()) web.goBack() else super.onBackPressed()
    }
}
