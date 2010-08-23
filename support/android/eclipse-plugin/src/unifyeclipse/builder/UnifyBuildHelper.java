package unifyeclipse.builder;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.eclipse.core.resources.IProject;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IPath;
import org.eclipse.core.runtime.Path;
import org.eclipse.core.runtime.Status;
import org.eclipse.ui.console.ConsolePlugin;
import org.eclipse.ui.console.IConsole;
import org.eclipse.ui.console.IConsoleManager;
import org.eclipse.ui.console.MessageConsole;
import org.eclipse.ui.console.MessageConsoleStream;

public class UnifyBuildHelper {
	static public final String GENERATOR_SCRIPT = "generate.py";
	static public final String UNIFY_VERSION = "framework/unify-version.txt";

	static private void runProcess(String generateCommand,
			IPath unifyApplicationPath) throws IOException {
		MessageConsoleStream consoleOut = getConsole().newMessageStream();

		ProcessBuilder processBuild = new ProcessBuilder("python",
				unifyApplicationPath.append(GENERATOR_SCRIPT).toOSString(),
				generateCommand);

		Process process = processBuild.start();

		InputStream is = process.getInputStream();
		InputStreamReader isr = new InputStreamReader(is);
		BufferedReader br = new BufferedReader(isr);
		String line;

		while ((line = br.readLine()) != null) {
			consoleOut.println(line);
		}
		
		consoleOut.flush();
		consoleOut.close();
	}

	static public void runClean(IPath unifyApplicationPath) throws IOException {
		runProcess("clean", unifyApplicationPath);
	}

	static public void runBuild(IPath unifyApplicationPath) throws IOException {
		runProcess("build-phonegap", unifyApplicationPath);
	}

	static public IProject getUnifyProject(IProject unifyEclipseApplicationProject)
			throws CoreException {
		IProject unifyProject = null;

		String name = "";

		for (IProject project : unifyEclipseApplicationProject
				.getReferencedProjects()) {
			name += " - " + project.getName();
			if (project.exists(new Path(UNIFY_VERSION))) {
				unifyProject = project;
				break;
			}
		}

		if (unifyProject == null) {
			throw new CoreException(new Status(Status.ERROR,
					UnifyBuilder.BUILDER_ID,
					"No unify found in referenced projects " + name));
		}

		return unifyProject;
	}

	static public IProject getUnifyApplicationProject(
			IProject unifyEclipseApplicationProject) throws CoreException {
		IProject unifyApplicationProject = null;

		String name = "";

		for (IProject project : unifyEclipseApplicationProject
				.getReferencedProjects()) {
			name += " - " + project.getName();
			if (project.exists(new Path(GENERATOR_SCRIPT))) {
				unifyApplicationProject = project;
				break;
			}
		}

		if (unifyApplicationProject == null) {
			throw new CoreException(new Status(Status.ERROR,
					UnifyBuilder.BUILDER_ID,
					"No unify found in referenced projects " + name));
		}

		return unifyApplicationProject;
	}

	static public MessageConsole getConsole() {
		String name = "Unify";

		ConsolePlugin plugin = ConsolePlugin.getDefault();
		IConsoleManager conMan = plugin.getConsoleManager();
		IConsole[] existing = conMan.getConsoles();
		for (int i = 0; i < existing.length; i++)
			if (name.equals(existing[i].getName()))
				return (MessageConsole) existing[i];

		// no console found, so create a new one
		MessageConsole myConsole = new MessageConsole(name, null);
		conMan.addConsoles(new IConsole[] { myConsole });
		return myConsole;
	}
}
