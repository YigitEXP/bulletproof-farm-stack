#!/bin/bash

# Trivy'nin yolunu Bash ortamına ekliyoruz
export PATH=$PATH:/c/DEVELOPER/tools
COMMAND=$1

# Yardım menüsünü bir fonksiyon olarak tanımlıyoruz (kod tekrarını önler)
show_help() {
    echo "--------------------------------------------------"
    echo "❌ Hatalı kullanım veya eksik komut!"
    echo "Kullanım Şekli: bash operate.sh [KOMUT]"
    echo "Geçerli Komutlar:"
    echo "  start          -> Sistemi derler ve ayağa kaldırır."
    echo "  stop           -> Sistemi durdurur ve konteynerleri siler."
    echo "  logs           -> Backend servisinin loglarını gösterir."
    echo "  logs-frontend  -> Frontend (Nginx) loglarını gösterir."
    echo "  status         -> Container durumlarını gösterir."
    echo "  backup         -> Veritabanının şifreli yedeğini alır."
    echo "  trivy-scan     -> Güvenlik taraması yapar (FS + Images)."
    echo "  k6-test        -> Grafana K6 ile yük testi yapar."
    echo "  hard-start     -> Cache temizleyerek frontend'i yeniden derler."
    echo "--------------------------------------------------"
}

# Komut girilmemişse yardımı göster ve çık
if [ -z "$COMMAND" ]; then
    show_help
    exit 1
fi

case "$COMMAND" in
    "start")
        echo "🚀 Sistem ayağa kaldırılıyor.."
        docker-compose up -d --build
        echo "✅ http://localhost:5173 adresinden erişebilirsiniz."
        ;;

    "stop")
        echo "🛑 Sistem durduruluyor..."
        docker-compose down
        ;;

    "logs")
        echo "📋 Backend logları getiriliyor..."
        docker-compose logs -f backend-api
        ;;

    "logs-frontend")
        echo "📋 Frontend (Nginx) logları getiriliyor..."
        docker-compose logs -f frontend
        ;;

    "backup")
        echo "--- 🔐 Şifreli Yedekleme Başlatılıyor ---"
        mkdir -p ./.secret_backups
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        
        # .env içinden anahtarı alıyoruz
        MASTER_KEY=$(grep MASTER_KEY .env | cut -d '=' -f2)
        
        if [ -z "$MASTER_KEY" ]; then
            echo "❌ Hata: .env içinde MASTER_KEY bulunamadı!"
            exit 1
        fi

        # Veriyi çek ve OpenSSL ile AES-256 kullanarak şifrele
        docker exec sec-mongodb mongodump --archive --gzip --db bulletproof_db | \
        openssl enc -aes-256-cbc -salt -pbkdf2 -iter 100000 \
        -out ./.secret_backups/backup_$TIMESTAMP.gz.enc \
        -pass pass:"$MASTER_KEY"

        chmod 600 ./.secret_backups/*.enc
        echo "✅ Yedek oluşturuldu: .secret_backups/backup_$TIMESTAMP.gz.enc"
        
        # 7 günden eski yedekleri temizle
        find ./.secret_backups/ -name "*.enc" -type f -mtime +7 -delete
        ;;

    "trivy-scan")
        echo "🔍 Güvenlik taraması yapılıyor..."
        if ! command -v trivy &> /dev/null; then
            echo "❌ Trivy bulunamadı! Lütfen PATH ayarını kontrol edin."
            exit 1
        fi

        mkdir -p trivy-reports
        trivy fs . --scanners vuln,secret,config --severity HIGH,CRITICAL --format table --output trivy-reports/fs-report.txt

        for img in $(docker-compose config --images); do
            safe_name=$(echo "$img" | tr '/:' '__')
            echo "📦 Image taranıyor: $img"
            trivy image "$img" --severity HIGH,CRITICAL --format table --output "trivy-reports/image-${safe_name}.txt"
        done
        echo "✅ Raporlar 'trivy-reports/' dizinine kaydedildi."
        ;;

    "k6-test")
        echo "🥊 Grafana K6 Yük Testi Başlatılıyor..."
        cd vulnerability-tests && {
            cat loadtest.js | docker run --rm -i grafana/k6 run -
            cd ..
        } || echo "❌ Hata: vulnerability-tests dizini bulunamadı!"
        ;;

    "status")
        echo "📊 Container Durumları:"
        docker-compose ps
        ;;

    "hard-start")
        echo "🔄 Tam temizlik ve Hard Start başlatılıyor..."
        docker-compose down
        docker-compose build --no-cache frontend
        docker-compose up -d
        echo "🚀 Sistem en güncel haliyle yayında!"
        ;;

    *)
        show_help
        exit 1
        ;;
esac