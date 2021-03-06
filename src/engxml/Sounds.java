package engxml;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringReader;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.sun.jndi.toolkit.url.Uri;

public class Sounds {

	public static void main(String[] args) throws IOException {
		String vJsn = "elementaryJson";
		String srcDir = "/home/vns/gtranslator-dictionary/sounds/br/";
		String trgDir = "/home/vns/workspace/engxml/sound/words/br/";
		String trgJsonFile = "/home/vns/workspace/engxml/elementary.js";
		Path phrasesPath = Paths.get(System.getProperty("user.dir"),
				"elementary.words");
		// System.out.println(phrasesPath.toFile().getAbsolutePath());
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		Files.copy(phrasesPath, out);
		BufferedReader reader = new BufferedReader(new StringReader(new String(
				out.toByteArray())));
		List<String> words = new ArrayList<>();
		String s;
		while ((s = reader.readLine()) != null) {
			words.add(s);
		}
		// System.out.println(Arrays.toString(words.toArray()));
		String unit = "";
		String unitTitle = "";
		String phrases = "";
		String units = "";
		String unitPath = "";
		for (String word : words) {
			if (word.replaceAll("[ ]+", "").isEmpty()) {
				continue;
			}
			if (word.startsWith("#")) {
				if (!phrases.isEmpty()) {
					units += (units.isEmpty() ? "\n" : ",\n")
							+ String.format(f1, unit, unitTitle, unitPath,
									phrases.substring(1, phrases.length() - 1));
				}
				unit = word.split("#")[1];
				unitTitle = word.split("#")[2];
				unitPath = word.split("#")[3];
				phrases = "";
				continue;
			}
			String[] ws = word.split("#");
			StringBuilder sb = new StringBuilder();
			Set<String> duplicates = new HashSet<String>();
			for (int i = 1; i < ws.length; i++) {
				String normal = ws[i].trim();
				if (!normal.isEmpty() && !duplicates.contains(normal)) {
					duplicates.add(normal);
					if (sb.length() > 0) {
						sb.append(", ");
					}
					sb.append("\"");
					sb.append(normal);
					sb.append("\"");
				}
			}
			String parts = sb.toString();

			String phrase = ws[0];
			sb = new StringBuilder();
			duplicates = new HashSet<String>();
			for (String w : phrase.split("[ ,;_]")) {
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
			String data = String.format(f2, "\"" + phrase.replace(".mp3", "")
					+ "\"", "\"" + phrase + "\"", sb.toString(), parts);
			phrases += (phrases.isEmpty() ? "" : "\n") + data + ",";
		}
		units += (units.isEmpty() ? "\n" : ",\n")
				+ String.format(f1, unit, unitTitle, unitPath,
						phrases.substring(1, phrases.length() - 1));

		String jsonText = "var " + vJsn + " = {\n" + units + "\n}";
		System.out.println(jsonText);
		Files.copy(new ByteArrayInputStream(jsonText.getBytes()),
				Paths.get(trgJsonFile), StandardCopyOption.REPLACE_EXISTING);

	}

	static String f1 = "%s : {\n" + "	name : \"%s\",\n"
			+ "	phrase_path : \"%s\",\n"
			+ "	words_path : \"sound/words/br/\",\n" + "	data : [ %s" + " ]\n"
			+ "}";
	static String f2 = "\t{\n" + "\t\tphrase : %s,\n" + "\t\tsource : %s,\n"
			+ "\t\twords : [ %s ],\n" + "\t\tothers : [ %s ]\n" + "\t}";
}