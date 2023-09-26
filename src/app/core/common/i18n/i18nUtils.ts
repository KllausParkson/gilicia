export class I18nUtils {

    public static Languages(): string[] {
        return ["pt", "pt-PT", "en", "es", "ja"];
    }

    public static Internationalizations(): string[] {
        return ["pt-BR", "pt-PT",
                "en-US", "en-GB", "en-CA", "en-AU",
                "es-ES", "es-PY", "es-AR", "es-CL", "ja-JP"]
            .sort((n1, n2) => {
                if (n1.substring(3, 5) > n2.substring(3, 5)) {
                    return 1;
                }
                if (n1.substring(3, 5) < n2.substring(3, 5)) {
                    return -1;
                }
                return 0;
            });;
    }
}