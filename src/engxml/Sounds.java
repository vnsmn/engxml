package engxml;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Sounds {

	public static void main(String[] args) throws IOException {
		String srcDir = "/home/vns/gtranslator-dictionary/sounds/br/";
		String trgDir = "/home/vns/workspace/engxml/sound/words/br/";
		Path phrasesPath = Paths.get(System.getProperty("user.dir"), "elementary.words");
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		Files.copy(phrasesPath, out);
		BufferedReader reader = new BufferedReader(new StringReader(new String(out.toByteArray())));		
		List<String> words = new ArrayList<>();
		String s;
		while ((s = reader.readLine()) != null) {
			words.add(s.split(".mp3")[0]);
		}
		String unit = "";
		String unitTitle = "";
		String phrases = "";
		String units = "";
		for (String word : words) {
			if (word.replaceAll("[ ]+", "").isEmpty()) {
				continue;
			}
			if (word.startsWith("#")) {
				if (!phrases.isEmpty()) {
					units += (units.isEmpty() ? "\n" : ",\n") + String.format(f1, unit, unitTitle, phrases.substring(1, phrases.length() - 1));
				}
				unit = word.split("#")[1];
				unitTitle = word.split("#")[2];
				phrases = "";
				continue;
			}
			StringBuilder sb = new StringBuilder();
			Set<String> duplicates = new HashSet<String>();
			for (String w : word.split("[ ,;_]")) {
				String normal = w.trim();				
				if (!normal.isEmpty() && !duplicates.contains(normal)) {
					duplicates.add(normal);
					Path src = Paths.get(srcDir, normal + ".mp3");
					Path trg = Paths.get(trgDir, normal + ".mp3");
					if (src.toFile().exists()) {
						if (sb.length() > 0) {
							sb.append(", ");
						}
						sb.append("\"");
						sb.append(normal);
						sb.append("\"");
						if (!trg.toFile().exists()) {
							Files.copy(src, trg,
									StandardCopyOption.REPLACE_EXISTING);
						}
					}
				}
			}
			String data = String.format(f2, "\"" + word + "\"", "\"" + word + ".mp3\"", sb.toString());			
			phrases += (phrases.isEmpty() ? "" : "\n") + data +  ",";			
		}
		units += (units.isEmpty() ? "\n" : ",\n") + String.format(f1, unit, unitTitle, phrases.substring(1, phrases.length() - 1));
		System.out.println(units);
	}
	
static String f1 = 
"%s : {\n" +
"	name : \"%s\",\n" +
"	phrase_path : \"sound/phrases/basic/u1/\",\n" +
"	words_path : \"sound/words/br/\",\n" +
"	data : [ %s" + " ]\n" +
"}";
static String f2 =
"\t{\n" +
"\t\tphrase : %s,\n" +
"\t\tsource : %s,\n" +
"\t\twords : [ %s ],\n" +
"\t\tothers : [ ]\n" +
"\t}";
}